import { UploadFootprintHeadImg } from './Types/api.js';

export const uploadFootprintHeadImgRes = {
  customize: async (
    permanentURL: string,
  ): Promise<UploadFootprintHeadImg.IUploadFootprintHeadImgResponse> => {
    const response: UploadFootprintHeadImg.IUploadFootprintHeadImgResponse = {
      data: {
        url: permanentURL,
      },
    };
    return response;
  },
};
