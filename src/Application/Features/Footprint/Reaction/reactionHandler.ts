import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { reactionRes } from './reactionRes.js';
import { Reaction } from './Types/api.js';

export const footprintReactionHandler = {
  handle: async (reaction: Reaction.IReactionReq) => {
    if (reaction.reaction === "empty") {
      await footprintService.removeReaction({
        userId: reaction.userId,
        footprintId: reaction.footprintId
      });
    } else {
      await footprintService.expressReaction({
        userId: reaction.userId,
        footprintId: reaction.footprintId,
        reaction: reaction.reaction
      });
    }
    return reactionRes.customize(reaction.reaction);
  },
};
