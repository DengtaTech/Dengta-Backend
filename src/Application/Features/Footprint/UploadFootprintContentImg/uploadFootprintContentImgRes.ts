import { UploadFootprintContentImg } from './Types/api.js';

export const uploadFootprintHeadImgRes = {
  customize: async (
    permanentURL: string,
  ): Promise<UploadFootprintContentImg.IUploadFootprintContentImgResponse> => {
    const response: UploadFootprintContentImg.IUploadFootprintContentImgResponse =
      {
        data: {
          url: permanentURL,
        },
      };
    return response;
  },
};
