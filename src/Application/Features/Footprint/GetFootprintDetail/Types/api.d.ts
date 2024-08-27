import { Footprint } from '../../../../../Database/Entities/footprint.js';

declare namespace GetFootprintDetail {
  type FootprintDetailDto = Footprint & {
    hashtags: string[];
    reactionCounts: Record<NativeReaction, number>;
  };
  type FootprintDetailResponse = {
    data: {
      footprint: FootprintDetailDto;
    };
  };
}
