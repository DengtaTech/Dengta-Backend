import { EntityManager } from 'typeorm';
import { MUserFootprintReaction } from '../../Database/Entities/mUserFootprintReaction.js';

export const mUserFootprintReactionRepo = {
  findByIds: async (
    reaction: Pick<MUserFootprintReaction, 'userId' | 'footprintId'>,
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(MUserFootprintReaction, {
        where: {
          userId: reaction.userId,
          footprintId: reaction.footprintId,
        },
      });
    } else {
      return await MUserFootprintReaction.findOne({
        where: {
          userId: reaction.userId,
          footprintId: reaction.footprintId,
        },
      });
    }
  },
  expressReaction: async (
    reaction: Pick<MUserFootprintReaction, 'userId' | 'footprintId' | 'reactionTypeId'>,
    transactionManager?: EntityManager,
  ) => {
    const newReaction = new MUserFootprintReaction();
    newReaction.userId = reaction.userId;
    newReaction.footprintId = reaction.footprintId;
    newReaction.reactionTypeId = reaction.reactionTypeId;
    if (transactionManager) {
      return await transactionManager.save(newReaction);
    } else {
      return await newReaction.save();
    }
  },
  deleteReaction: async (
    reaction: MUserFootprintReaction,
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.remove(MUserFootprintReaction, reaction);
    } else {
      return await MUserFootprintReaction.remove(reaction);
    }
  },
};
