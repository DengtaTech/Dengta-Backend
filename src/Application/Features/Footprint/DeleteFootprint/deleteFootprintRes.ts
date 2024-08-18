import { DeleteFootprint } from "./Types/api.js";


export const deleteFootprintRes = {
  customize: async (): Promise<DeleteFootprint.IDeleteFootprintResponse> => {
    const response: DeleteFootprint.IDeleteFootprintResponse = {
      data: {
        message: 'delete successfully',
      },
    };
    return response;
  },
};
