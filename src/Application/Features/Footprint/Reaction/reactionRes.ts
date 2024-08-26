import { Reaction } from './Types/api.js';
import { type NativeReaction } from './Types/reactions.js';

export const reactionRes = {
  customize: (reaction: NativeReaction | 'empty'): Reaction.IReactionRes => ({
    data: {
      reaction,
    },
  }),
};
