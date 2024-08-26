import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { linkRepo } from '../Repository/linkRepo.js';
import { EmailExistsError, UserNotFoundError } from '../../Errors/errors.js';
import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { Signin } from '../../Application/Features/User/SignIn/Types/api.js';
import { PatchUserInfo } from '../../Application/Features/User/PatchUserInfo/Types/api.js';
import { MUserProfileHashTag } from '../../Database/Entities/mUserProfileHashTag.js';
import { profileHashTagRepo } from '../Repository/profileHashTagRepo.js';
import { GetUserInfo } from '../../Application/Features/User/GetUserInfo/Types/api.js';

export const userService = {
  signUp: async (
    userInfoObj: Signup.ISignUpReq,
  ): Promise<Signup.ISignUpDto> => {
    // try {
    const checkUserExist = await userRepo.findByEmail(userInfoObj.email);

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
          newUser,
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
        return {
          id: newUser.id,
          fullName: newUser.fullName,
          lifeRole: newUser.lifeRole,
          email: newUser.email,
          clerkId: newUser.clerkId,
          links: initLinks.map((link) => {
            const { sourceName, url } = link;
            return { sourceName, url };
          }),
        } as Signup.ISignUpDto;
      } catch (error) {
        console.error('Error in DB ->', error);
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
      password: checkUserExist.userCredential.password,
    };
  },

  getUserInfo: async (id: string): Promise<GetUserInfo.UserWithHashtags> => {
    const userInfo = await userRepo.findById(id, undefined, [
      'links',
      'mUserProfileHashTag',
      'mUserProfileHashTag.profileHashTag',
    ]);
    if (!userInfo) {
      throw new UserNotFoundError();
    }
    if ('hashtags' in userInfo) {
      return userInfo;
    } else {
      throw new Error('userInfo without hashtags should not happen');
    }
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
        }

        await transactionManager.save(user);
      });
    } catch (error) {
      console.error('Error in DB ->', error);
      throw error;
    }
  },
};
