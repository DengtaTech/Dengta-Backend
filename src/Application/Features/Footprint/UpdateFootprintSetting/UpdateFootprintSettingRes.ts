import { Footprint } from '../../../../Database/Entities/footprint.js';
import { PatchFootprintSetting } from './Types/api.js';

export const patchFootprintSettingRes = {
  customize: async (
    result: Footprint,
  ): Promise<PatchFootprintSetting.IPatchFootprintSettingResponse> => {
    const response: PatchFootprintSetting.IPatchFootprintSettingResponse = {
      data: {
        footrpint: result,
      },
    };
    return response;
  },
};
