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
import { FootprintHashTag } from '../../Database/Entities/footprintHashTag.js';
import { footprintHashTagRepo } from '../Repository/footprintHashTagRepo.js';
import { mFootprintFootprintHashTagRepo } from '../Repository/mFootprintFootprintHashTagRepo.js';

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
  publish: async (
    footprintObj: PublishFootprint.IPublishFootprintReqBody,
  ): Promise<Footprint> => {
    const footprint = await footprintRepo.findByFootprintId(
      footprintObj.footprintId,
    );
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
            await footprintHashTagRepo.findByContent(tagContent);
          if (!footprintHashTag) {
            footprintHashTag =
              await footprintHashTagRepo.insertNewFootprintHashTag(
                tagContent,
                transactionManager,
              );
          }
          await mFootprintFootprintHashTagRepo.insertNewRecord(
            updatedFootprint,
            footprintHashTag as FootprintHashTag,
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
    const footprint = await footprintRepo.findByFootprintId(footprintId);
    if (!footprint) {
      throw new FootprintNotFoundError();
    }
    footprint.titleImage = permanentURL;
    await footprint.save();
  },
};
