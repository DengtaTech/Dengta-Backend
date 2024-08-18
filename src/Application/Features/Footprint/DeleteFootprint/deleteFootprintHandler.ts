import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { deleteFootprintRes } from './deleteFootprintRes.js';
import { DeleteFootprint } from './Types/api.js';


export const deleteFootprintHandler = {
  handle: async (
    footprintId: string,
  ): Promise<DeleteFootprint.IDeleteFootprintResponse> => {
    //init
    let response = null;

    await footprintService.deleteFootprint(footprintId);

    response = await deleteFootprintRes.customize();

    return response;
  },
};