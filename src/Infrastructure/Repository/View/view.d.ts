import { Footprint } from '../../../../../Database/Entities/footprint.js';

declare namespace View {
  type FootprintDto = Footprint & {
    hashtags: string[];
    reactionCounts: Record<NativeReaction, number>;
  };
}
