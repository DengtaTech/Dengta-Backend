import { type NativeReaction } from '../../Application/Features/Footprint/Reaction/Types/reactions.js';
import { ReactionType } from '../../Database/Entities/reactionType.js';
import { reactionTypeRepo } from '../Repository/reactionTypeRepo.js';

export const reactionTypeService = {
  findByName: async (name: NativeReaction): Promise<ReactionType | null> => {
    return reactionTypeRepo.findByName(name);
  },
};
