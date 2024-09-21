import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { MUserFootprintReaction } from '../../../../../Database/Entities/mUserFootprintReaction.ts';
import { Notification } from '../../../../../Database/Entities/notification.ts';
import { ReactionType } from '../../../../../Database/Entities/reactionType.ts';
import { NativeReaction } from './reactions.ts';

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
    };
  };

  // 未來在寄信時使用
  interface ReactionCount {
    name: NativeReaction;
    reaction_count: number;
  }
}
