import { minioService } from '../../../../Infrastructure/Service/minioService.js';
import { footprintBucket } from '../../../../Database/FileServer/minioClient.js';

import { UploadFootprintHeadImg } from './Types/api.js';
import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';
import { uploadFootprintHeadImgRes } from './uploadFootprintHeadImgRes.js';

export const uploadFootprintHeadImgHandler = {
  handle: async (
    footprintId: string,
    file: Express.Multer.File,
  ): Promise<UploadFootprintHeadImg.IUploadFootprintHeadImgResponse> => {
    const permanentURL = await minioService.uploadFootprintHeadImg(
      footprintId,
      file,
    );
    if (!permanentURL) {
      throw new Error('Failed to upload footprint head img');
    }

    await footprintService.updateFootprintHeadImg(footprintId, permanentURL);

    const response = await uploadFootprintHeadImgRes.customize(permanentURL);
    return response;
  },
};
