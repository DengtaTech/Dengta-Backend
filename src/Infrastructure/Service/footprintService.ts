import { Reaction } from '../../Application/Features/Footprint/Reaction/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { MUserFootprintReaction } from '../../Database/Entities/mUserFootprintReaction.js';
import {
  InvalidInputError,
  UserNotFoundError,
  FootprintNotFoundError,
  CardUrlNotExistsError,
  UserShouldExistError,
  UserNotAuthor,
  CardShouldExistError,
} from '../../Errors/errors.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { mUserFootprintReactionRepo } from '../Repository/mUserFootprintReactionRepo.js';
import { reactionTypeRepo } from '../Repository/reactionTypeRepo.js';
import { userRepo } from '../Repository/userRepo.js';
import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { PublishFootprint } from '../../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { Footprint } from '../../Database/Entities/footprint.js';
import { footprintHashTagRepo } from '../Repository/footprintHashTagRepo.js';
import { mFootprintFootprintHashTagRepo } from '../Repository/mFootprintFootprintHashTagRepo.js';
import { PatchFootprintSetting } from '../../Application/Features/Footprint/UpdateFootprintSetting/Types/api.js';
import { MFootprintFootprintHashTag } from '../../Database/Entities/mFootprintFootprintHashTag.js';
import { GetFootprintDetail } from '../../Application/Features/Footprint/GetFootprintDetail/Types/api.js';
import { embeddingService } from './embeddingService.js';
import { Notification } from '../../Database/Entities/notification.js';
import { notificationRepo } from '../Repository/notificationRepo.js';
import { Card } from '../../Database/Entities/card.js';
import logger from '../../Database/Logger/index.js';
import { cardRepo } from '../Repository/cardRepo.js';

export const footprintService = {
  expressReaction: async (
    reaction: Reaction.IExpressReactionDto,
  ): Promise<MUserFootprintReaction> => {
    return Database.transaction(async (transactionManager) => {
      try {
        if (
          (await userRepo.findById(reaction.userId, transactionManager)) ===
          null
        ) {
          throw new UserNotFoundError();
        }

        const footprint = await footprintRepo.findById(
          reaction.footprintId,
          transactionManager,
        );
        if (footprint === null) {
          throw new FootprintNotFoundError();
        }

        const reactionType = await reactionTypeRepo.findByName(
          reaction.reaction,
        );
        if (reactionType === null) {
          throw new InvalidInputError('No such reaction type');
        }

        const mUserFootprintReaction =
          await mUserFootprintReactionRepo.expressReaction(
            {
              userId: reaction.userId,
              footprintId: reaction.footprintId,
              reactionTypeId: reactionType.id,
            },
            transactionManager,
          );
        footprint.totalLike += 1;
        await transactionManager.save(footprint);
        // build notification
        const notification = Notification.create({
          userId: footprint.userId,
          type: 'footprint_reaction',
          title: '有人對您的足跡做出了表情',
          content: `您的足跡得到了 ${reaction.reaction}`,
          relatedUserId: reaction.userId,
          relatedFootprintId: reaction.footprintId,
        });

        await notificationRepo.insertNewNotification(
          notification,
          transactionManager,
        );

        return mUserFootprintReaction;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  removeReaction: async (
    reaction: Reaction.IRevokeReactionDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      try {
        if (
          (await userRepo.findById(reaction.userId, transactionManager)) ===
          null
        ) {
          throw new UserNotFoundError();
        }
        const footprint = await footprintRepo.findById(
          reaction.footprintId,
          transactionManager,
        );
        if (footprint === null) {
          throw new FootprintNotFoundError();
        }
        const reactionObj = await mUserFootprintReactionRepo.findByIds(
          reaction,
          transactionManager,
        );
        if (reactionObj === null) {
          // ignore on inexistent reaction
          return;
        }
        await mUserFootprintReactionRepo.deleteReaction(
          reactionObj,
          transactionManager,
        );
        footprint.totalLike -= 1;
        await transactionManager.save(footprint);
      } catch (error) {
        logger.error(error, 'Error in DB ');
        throw error;
      }
    });
  },
  initFootprint: async (
    userId: string,
    status: string,
  ): Promise<InitFootprint.IInitFootprintDto> => {
    const result = await footprintRepo.initFootprint(userId, status);
    return result;
  },
  // TODO: 可能public 跟 update 可以合併用一個就好
  publish: async (
    footprintObj: PublishFootprint.IPublishFootprintReqBody,
  ): Promise<Footprint> => {
    const footprint = await footprintRepo.findById(footprintObj.footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        const updatedFootprint = await footprintRepo.updateFootprint(
          footprint,
          footprintObj,
          transactionManager,
        );
        for (const tagContent of footprintObj.hashtags) {
          let footprintHashTag =
            await footprintHashTagRepo.findOrCreateByContent(
              tagContent,
              transactionManager,
            );

          await mFootprintFootprintHashTagRepo.insertNewRecord(
            updatedFootprint.id,
            footprintHashTag.id,
            transactionManager,
          );

          await embeddingService.findOrinsertFootprintHashTagEmbedding(
            {
              id: footprintHashTag.id,
              content: tagContent,
            },
            transactionManager,
          );
          const authorSharingCard = await cardRepo.findByUserId(
            footprint.userId,
          );
          if (!authorSharingCard) throw new CardShouldExistError();
          // 若用戶分享卡維預設最新足跡 -> 自動更新用
          if (authorSharingCard.latest === true) {
            authorSharingCard.footprintId = updatedFootprint.id;
            await transactionManager.save(authorSharingCard);
          }
        }
        return updatedFootprint;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
  updateFootprintHeadImg: async (
    footprintId: string,
    permanentURL: string,
  ): Promise<void> => {
    const footprint = await footprintRepo.findById(footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    footprint.titleImage = permanentURL;
    await footprint.save();
  },
  patchFootprintSetting: async (
    updateFields: PatchFootprintSetting.PatchFootprintSettingReqBody,
  ): Promise<Footprint> => {
    const footprint = await footprintRepo.findById(updateFields.footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }

    const { hashtags, ...otherFields } = updateFields;

    Object.assign(footprint, otherFields);
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        if (hashtags && hashtags.length > 0) {
          await transactionManager.delete(MFootprintFootprintHashTag, {
            footprintId: footprint.id,
          });

          const newHashtags = await Promise.all(
            hashtags.map((hashtag) => {
              return footprintHashTagRepo.findOrCreateByContent(
                hashtag,
                transactionManager,
              );
            }),
          );
          await Promise.all(
            newHashtags.map((hashtag) =>
              mFootprintFootprintHashTagRepo.insertNewRecord(
                footprint.id,
                hashtag.id,
                transactionManager,
              ),
            ),
          );
        }
        await transactionManager.save(footprint);
        return footprint;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  deleteFootprint: async (footprintId: string): Promise<void> => {
    const footprint = await footprintRepo.findById(footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        // cascade delete the footprintHashTag / reaction
        await transactionManager.delete(Footprint, { id: footprint.id });
        const card = await cardRepo.findByUserId(footprint.userId);
        if (!card) throw new CardShouldExistError();
        const latestFootprint = await footprintRepo.findLatestByUserId(
          footprint.userId,
        );
        if (card.latest) {
          card.footprintId = latestFootprint ? latestFootprint.id : null;
          await transactionManager.save(card);
          return;
        }
        if (footprintId === card.footprintId) {
          card.latest = true;
          card.footprintId = latestFootprint ? latestFootprint.id : null;
          await transactionManager.save(card);
        }
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  getFootprintByUserId: async (
    userId: string,
    publicOnly: boolean,
    offset: number,
  ) => {
    const footprints = await footprintRepo.findByUserIdWithAllRelations(
      userId,
      publicOnly,
      offset,
    );
    return {
      footprints,
    };
  },
  getFootprintDetail: async (
    footprintId: string,
  ): Promise<GetFootprintDetail.FootprintDetailDtoWithNext> => {
    const currentFootprint =
      await footprintRepo.findOneByIdWithAllRelations(footprintId);
    const next = await footprintRepo.findNextFootprintByOccurAt(
      currentFootprint.occurAt,
      currentFootprint.userId,
    );
    return {
      ...currentFootprint,
      nextFootprint: next ? { ...next } : null,
    } as GetFootprintDetail.FootprintDetailDtoWithNext;
  },
  getPublicFootprintByCardUrl: async (cardUrl: string, page: number) => {
    const url = `https://dengta.org/${cardUrl}`;
    const card = await Card.findOne({
      where: { cardUrl: url },
    });
    if (!card) {
      throw new CardUrlNotExistsError();
    }
    return await footprintService.getFootprintByUserId(card.userId, true, page);
  },
  postQuickFootprint: async (
    userId: string,
    content: string,
  ): Promise<void> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserShouldExistError();
    }
    return Database.transaction(async (transactionManager) => {
      try {
        const newFootprint = new Footprint();
        newFootprint.content = content;
        newFootprint.userId = userId;
        newFootprint.status = 'published';
        newFootprint.isQuickPost = true;
        await transactionManager.save(newFootprint);
        return;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
  patchQuickPost: async (
    userId: string,
    content: string,
    footprintId: string,
  ): Promise<void> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserShouldExistError();
    }
    const footprint = await footprintRepo.findById(footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    if (footprint.userId !== userId) {
      throw new UserNotAuthor();
    }
    return Database.transaction(async (transactionManager) => {
      try {
        footprint.content = content;
        await transactionManager.save(footprint);
        return;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
  deleteQuickPost: async (
    userId: string,
    footprintId: string,
  ): Promise<void> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserShouldExistError();
    }
    const footprint = await footprintRepo.findById(footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    if (footprint.userId !== userId) {
      throw new UserNotAuthor();
    }
    return Database.transaction(async (transactionManager) => {
      try {
        await transactionManager.delete(Footprint, { id: footprint.id });
        return;
      } catch (error) {
        logger.error(error, 'Error in DB layer');
        throw error;
      }
    });
  },
};
