import { Footprint } from '../../../../../Database/Entities/footprint.js';

declare namespace GetFootprintDetail {
  type FootprintDetailDto = Footprint & {
    hashtags: string[];
    reactionCounts: Record<NativeReaction, number>;
  };
  type FootprintDetailDtoWithNext = FootprintDetailDto & {
    nextFootprint: {
      id: string;
      title: string | null;
    } | null;
  };
  type FootprintDetailResponse = {
    data: {
      footprint: FootprintDetailDtoWithNext;
    };
  };
}
