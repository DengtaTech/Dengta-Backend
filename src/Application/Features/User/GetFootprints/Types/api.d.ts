import { Footprint } from '../../../../../Database/Entities/footprint.js';

declare namespace GetFootprints {
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
