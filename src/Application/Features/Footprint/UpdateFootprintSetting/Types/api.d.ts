import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { Dengta } from '../../../../../Types/common.js';
declare namespace PatchFootprintSetting {
  type PatchFootprintSettingReqBody = Partial<
    Pick<
      Footprint,
      'category' | 'milestone' | 'occurAt' | 'status' | 'title' | 'content'
    >
  > & {
    hashtags: string[];
    footprintId: string;
  };
  interface IPatchFootprintSettingResponse {
    data: {
      footrpint: Footprint;
    };
  }
}
