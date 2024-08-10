import { EntityManager } from 'typeorm';
import { ReactionType } from '../../Database/Entities/reactionType.js';

export const reactionRepo = {
  findById: async (
    id: ReactionType['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(ReactionType, { where: { id } });
    } else {
      return await ReactionType.findOne({ where: { id } });
    }
  }
};