import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { deleteFootprintRes } from './deleteFootprintRes.js';
import { DeleteFootprint } from './Types/api.js';

export const deleteFootprintHandler = {
  handle: async (
    footprintId: string,
  ): Promise<DeleteFootprint.IDeleteFootprintResponse> => {
    //init
    await footprintService.deleteFootprint(footprintId);

    const response = await deleteFootprintRes.customize();

    return response;
  },
};
