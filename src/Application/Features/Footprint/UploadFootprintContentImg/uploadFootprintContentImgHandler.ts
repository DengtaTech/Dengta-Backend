import { minioService } from '../../../../Infrastructure/Service/minioService.js';
import { UploadFootprintContentImg } from './Types/api.js';
import { uploadFootprintHeadImgRes } from './uploadFootprintContentImgRes.js';

export const uploadFootprintContentImgHandler = {
  handle: async (
    footprintId: string,
    file: Express.Multer.File,
  ): Promise<UploadFootprintContentImg.IUploadFootprintContentImgResponse> => {
    const permanentURL = await minioService.uploadFootprintContentImg(
      footprintId,
      file,
    );
    if (!permanentURL) {
      throw new Error('Failed to upload footprint head img');
    }

    const response = await uploadFootprintHeadImgRes.customize(permanentURL);
    return response;
  },
};
