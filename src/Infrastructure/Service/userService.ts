import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { linkRepo } from '../Repository/linkRepo.js';
import {
  CardSettingError,
  CardShouldExistError,
  CardUrlAlreadyExistsError,
  CardUrlNotExistsError,
  EmailExistsError,
  UserNotFoundError,
} from '../../Errors/errors.js';
import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { Signin } from '../../Application/Features/User/SignIn/Types/api.js';
import { PatchUserInfo } from '../../Application/Features/User/PatchUserInfo/Types/api.js';
import { MUserProfileHashTag } from '../../Database/Entities/mUserProfileHashTag.js';
import { profileHashTagRepo } from '../Repository/profileHashTagRepo.js';
import { User } from '../../Database/Entities/user.js';
import { SearchFollowees } from '../../Application/Features/User/SearchFollowees/Types/api.js';
import { GetUserInfo } from '../../Application/Features/User/GetUserInfo/Types/api.js';
import { UserInfo as UserInfoCache } from '../../Database/Cache/Entities/user.js';
import { embeddingService } from './embeddingService.js';
import { Card } from '../../Database/Entities/card.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import { GetCardInfo } from '../../Application/Features/User/GetCardInfo/Types/api.js';
import logger from '../../Database/Logger/index.js';
import { nanoid } from 'nanoid';
import { cardRepo } from '../Repository/cardRepo.js';
import { Not } from 'typeorm';

export const userService = {
  isUserIdExists: async (userId: string): Promise<boolean> => {
    const user = await userRepo.findById(userId);
    return !!user;
  },
  signUp: async (
    userInfoObj: Signup.ISignUpReq,
  ): Promise<Signup.ISignUpDto> => {
    // 這邊沒有檢查email而是直接檢查clerkid 所以當email存在時會拋 501
    const checkUserExist = await userRepo.findById(
      userInfoObj.clerkId,
      undefined,
      undefined,
    );
    if (checkUserExist) {
      throw new EmailExistsError();
    }

    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        const newUser = await userRepo.insertNewUser(
          userInfoObj,
          transactionManager,
        );
        await userCredentialRepo.insertNewUser(
          newUser.id,
          userInfoObj.password,
          transactionManager,
        );
        let initLinks: Link[] = [];
        if (userInfoObj.links.length !== 0) {
          initLinks = await linkRepo.initLink(
            userInfoObj.links,
            newUser.id,
            transactionManager,
          );
        }
        const cardUrl = `${process.env.SHARING_CARD_DOMAIN}/${nanoid(10)}`;
        const card = new Card();
        card.cardUrl = cardUrl;
        card.userId = newUser.id;
        card.footprintId = null;
        await transactionManager.save(card);
        return {
          id: newUser.id,
          fullName: newUser.fullName,
          lifeRole: newUser.lifeRole,
          email: newUser.email,
          links: initLinks.map((link) => {
            const { sourceName, url } = link;
            return { sourceName, url };
          }),
        } as Signup.ISignUpDto;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
  signIn: async (email: string): Promise<Signin.ISignInDto> => {
    const checkUserExist = await userRepo.findByEmail(email);
    if (!checkUserExist?.userCredential) {
      throw new UserNotFoundError();
    }
    return {
      id: checkUserExist.id,
      email: checkUserExist.email,
      password: checkUserExist.userCredential.password as string,
    };
  },

  getUserInfo: async (
    id: string,
  ): Promise<GetUserInfo.UserWithHashtagsAndLinks> => {
    const userInfoCache = await UserInfoCache.getByUserId(id);
    if (userInfoCache) {
      return userInfoCache;
    }
    const userInfo = await userRepo.findById(id, undefined, [
      'links',
      'mUserProfileHashTag',
      'mUserProfileHashTag.profileHashTag',
    ]);
    const card = await Card.findOne({
      where: { userId: id },
    });
    if (!card) {
      throw new CardUrlNotExistsError();
    }
    if (!userInfo) {
      throw new UserNotFoundError();
    }
    const fullInfo = {
      ...userInfo,
      cardUrl: card.cardUrl,
    } as GetUserInfo.UserWithHashtagsAndLinks;

    await UserInfoCache.setByUserId(id, fullInfo);
    return fullInfo;
  },

  updateAvatar: async (userId: string, permanentURL: string): Promise<void> => {
    const user = await userRepo.findById(userId);
    console.log('user', user);
    if (!user) {
      throw new UserNotFoundError();
    }
    user.avatar = permanentURL;
    await user.save();
  },

  updateUserInfo: async (
    userId: string,
    updateFields: PatchUserInfo.PatchUserInfoReqBody,
  ): Promise<void> => {
    const user = await userRepo.findById(userId, undefined, ['links']);
    if (!user) {
      throw new UserNotFoundError();
    }

    const { hashtags, links, ...otherFields } = updateFields;

    Object.assign(user, otherFields);
    try {
      await Database.transaction(async (transactionManager) => {
        if (links && links.length > 0) {
          await linkRepo.deleteLink(user.id, transactionManager);
          const newLinks = await Promise.all(
            links.map(async (link) => {
              const newLink = new Link();
              newLink.sourceName = link.sourceName;
              newLink.url = link.url;
              newLink.userId = userId;
              return await transactionManager.save(newLink);
            }),
          );
          user.links = newLinks;
        }

        if (hashtags && hashtags.length > 0) {
          await transactionManager.delete(MUserProfileHashTag, {
            userId: user.id,
          });

          const newHashtags = await Promise.all(
            hashtags.map(async (hashtag) => {
              return await profileHashTagRepo.findOrCreate(
                hashtag,
                transactionManager,
              );
            }),
          );

          const newMUserProfileHashTags = newHashtags.map((hashtag) => ({
            userId: user.id,
            profileHashTagId: hashtag.id,
          }));

          await transactionManager
            .createQueryBuilder()
            .insert()
            .into(MUserProfileHashTag)
            .values(newMUserProfileHashTags)
            .orIgnore()
            .execute();

          await Promise.all(
            newHashtags.map(async (hashTag) => {
              const hashTagInfo = {
                id: hashTag.id,
                content: hashTag.content,
              };

              await embeddingService.findOrInsertProfileHashTagEmbedding(
                hashTagInfo,
                transactionManager,
              );
            }),
          );
        }

        await transactionManager.save(user);
        await UserInfoCache.delByUserId(user.id);
      });
    } catch (error) {
      console.error('Error in DB ->', error);
      throw error;
    }
  },
  searchFollowees: async (
    followerId: User['id'],
    page: number,
    keywords?: string,
  ): Promise<SearchFollowees.ISearchFolloweesDto[]> => {
    return Database.transaction(async (transactionManager) => {
      try {
        if (
          (await userRepo.findById(followerId, transactionManager)) === null
        ) {
          throw new UserNotFoundError();
        }
        return await userRepo.findByNameAndTag({
          keywords,
          followerId,
          transactionManager,
          skip: (page - 1) * 20,
          limit: 20,
        });
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  editLink: async (
    userId: string,
    editLink: string,
    latest: boolean,
    footprintId?: string | null,
  ): Promise<string> => {
    return Database.transaction(async (transactionManager) => {
      try {
        if ((await userRepo.findById(userId, transactionManager)) === null) {
          throw new UserNotFoundError();
        }
        const cardUrl = `${process.env.SHARING_CARD_DOMAIN}/${editLink}`;
        let isConflict = await Card.findOne({
          where: {
            cardUrl: cardUrl,
            userId: Not(userId),
          },
        });
        if (isConflict) {
          throw new CardUrlAlreadyExistsError();
        }
        const card = await Card.findOne({
          where: { userId: userId },
        });
        if (!card) {
          throw new CardShouldExistError();
        }
        if (latest) {
          const footprint = await footprintRepo.findLatestByUserId(userId);
          // 若 latest = true
          // 前端不會傳 footprintId，這邊要自動更新
          card.latest = true;
          card.footprintId = footprint === null ? null : footprint.id;
        } else {
          // 若 latest = false => 使用者必須帶有效的 footprintId
          if (!footprintId) {
            throw new CardSettingError();
          }
          card.latest = false;
          card.footprintId = footprintId;
        }

        card.cardUrl = cardUrl;
        await transactionManager.save(card);

        return cardUrl;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  getCardUrl: async (userId: string): Promise<string> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserNotFoundError();
    }
    const card = await Card.findOne({
      where: { userId: userId },
    });
    if (!card) {
      throw new CardUrlNotExistsError();
    }
    return card.cardUrl;
  },
  // TODO: map 回傳足跡型態加上快取
  getFullCardInfo: async (cardUrl: string): Promise<GetCardInfo.ICardDto> => {
    const url = `${process.env.SHARING_CARD_DOMAIN}/${cardUrl}`;

    const card = await Card.findOne({
      where: { cardUrl: url },
    });
    if (!card) {
      throw new CardUrlNotExistsError();
    }
    let footprint: Footprint | null = null;
    if (card.footprintId) {
      // 若足跡被刪除分享卡 footrprint 就是 null（因為 card 並沒有跟 footprint 關聯）
      footprint = await footprintRepo.findById(card.footprintId);
    }
    const user = await userRepo.findById(card.userId, undefined, ['links']);
    if (!user) {
      throw new Error('User should not be null');
    }

    return {
      user,
      footprint,
    };
  },
  getCardSetting: async (userId: string): Promise<Card> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserNotFoundError();
    }
    const card = await cardRepo.findByUserId(userId);

    if (!card) {
      throw new CardShouldExistError();
    }
    return card;
  },
};
