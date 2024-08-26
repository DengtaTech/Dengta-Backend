import { Footprint } from '../../../../../Database/Entities/footprint.js';

declare namespace GetFootprints {
  // 為啥要有TFootprint
  type TFootprint = Omit<Footprint, 'content'> & {
    content?: string | null;
  };
  type TFootprintContent = TFootprint & {
    hashtags: string[];
    reactionCounts: Record<NativeReaction, number>;
  };
  type TFootprintResponse = {
    footprints: TFootprintContent[];
  };
}
