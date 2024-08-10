import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { MUserFootprintReaction } from '../../../../../Database/Entities/mUserFootprintReaction.ts';
import { ReactionType } from '../../../../../Database/Entities/reactionType.ts';

declare namespace Reaction {
  type IExpressReactionDto = IRevokeReactionDto & {
    reaction: NativeReaction;
  };

  type IRevokeReactionDto = Pick<
    MUserFootprintReaction,
    'userId' | 'footprintId'
  >;

  type IReactionReq = IRevokeReactionDto & {
    reaction: NativeReaction | 'empty';
  };

  type IReactionRes = {
    data: {
      reaction: NativeReaction | 'empty';
    }
  }
}
