import { type NativeReaction } from '../../Application/Features/Footprint/Reaction/Types/reactions.js';
import { ReactionType } from '../../Database/Entities/reactionType.js';
import { EntityManager } from 'typeorm';

export const reactionTypeRepo = {
  findByName: async (
    name: NativeReaction,
    transactionManager?: EntityManager,
  ): Promise<ReactionType | null> => {
    try {
      if (transactionManager) {
        const reactionType = await transactionManager.findOne(ReactionType, {
          where: { name },
        });
        return reactionType;
      } else {
        const reactionType = await ReactionType.findOne({
          where: { name },
        });
        return reactionType;
      }
    } catch (error) {
      console.error('Error finding reaction type by name:');
      throw error;
    }
  },
};