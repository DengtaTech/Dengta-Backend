import { Reaction } from '../../Application/Features/Footprint/Reaction/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { MUserFootprintReaction } from '../../Database/Entities/mUserFootprintReaction.js';
import { InvalidInputError, UserNotFoundError } from '../../Errors/errors.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { mUserFootprintReactionRepo } from '../Repository/mUserFootprintReactionRepo.js';
import { reactionTypeRepo } from '../Repository/reactionTypeRepo.js';
import { userRepo } from '../Repository/userRepo.js';

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
          throw new InvalidInputError('No such footprint');
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
          throw new InvalidInputError('No such footprint');
        }
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
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
    });
  },
};
