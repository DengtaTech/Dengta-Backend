import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { PatchFootprintSetting } from './Types/api.js';
import { patchFootprintSettingRes } from './UpdateFootprintSettingRes.js';


export const patchFootprintSettingHandler = {
  handle: async (
    reqBody: PatchFootprintSetting.PatchFootprintSettingReqBody,
  ): Promise<PatchFootprintSetting.IPatchFootprintSettingResponse> => {
    //init
    let response = null;

    const result = await footprintService.patchFootprintSetting(reqBody);

    response = await patchFootprintSettingRes.customize(result);

    return response;
  },
};
