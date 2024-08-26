import { Footprint } from '../../../Database/Entities/footprint.js';
import { NativeReaction } from '../../../Application/Features/Footprint/Reaction/Types/reactions.js';
declare namespace View {
  type FootprintDto = Footprint & {
    hashtags: string[];
    reactionCounts: Record<NativeReaction, number>;
  };
}
