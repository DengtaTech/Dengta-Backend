import { Reaction } from '../../Application/Features/Footprint/Reaction/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { MUserFootprintReaction } from '../../Database/Entities/mUserFootprintReaction.js';
import {
  InvalidInputError,
  UserNotFoundError,
  FootprintNotFoundError,
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

        if (
          (await footprintRepo.findById(
            reaction.footprintId,
            transactionManager,
          )) === null
        ) {
          throw new FootprintNotFoundError();
        }

        const reactionType = await reactionTypeRepo.findByName(
          reaction.reaction,
        );
        if (reactionType === null) {
          throw new InvalidInputError('No such reaction type');
        }

        return await mUserFootprintReactionRepo.expressReaction(
          {
            userId: reaction.userId,
            footprintId: reaction.footprintId,
            reactionTypeId: reactionType.id,
          },
          transactionManager,
        );
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

        if (
          (await footprintRepo.findById(
            reaction.footprintId,
            transactionManager,
          )) === null
        ) {
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
      } catch (error) {
        console.error('Error in DB ->', error);
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

        for (const tagContent of footprintObj.tags) {
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
        }
        return updatedFootprint;
      } catch (error) {
        console.error('Error in DB ->', error);
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

    const { tags, ...otherFields } = updateFields;

    Object.assign(footprint, otherFields);
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        if (tags && tags.length > 0) {
          await transactionManager.delete(MFootprintFootprintHashTag, {
            footprintId: footprint.id,
          });

          const newHashtags = await Promise.all(
            tags.map((hashtag) => {
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
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  getFootprintByUserId: async (userId: string, offset: number) => {
    const footprints = await footprintRepo.findByUserIdWithAllRelations(
      userId,
      offset,
    );
    return {
      footprints,
    };
  },
  getFootprintDetail: async (
    footprintId: string,
  ): Promise<GetFootprintDetail.FootprintDetailDto> => {
    const footprint =
      await footprintRepo.findOneByIdWithAllRelations(footprintId);
    return footprint as GetFootprintDetail.FootprintDetailDto;
  },
};
