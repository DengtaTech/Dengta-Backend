import { Request, Response } from 'express';
import mime from 'mime-types';
import { minioService } from '../Infrastructure/Service/minioService.js';

export const imageController = {
  getImage: async (req: Request, res: Response): Promise<void> => {
    const { bucketName } = req.params;
    const key = req.params[0];

    if (!bucketName || !key) {
      throw new Error('Missing bucketName or key parameter');
    }
    const imgStream = await minioService.getImg(bucketName, key);
    
    if (imgStream) {
        const contentType = mime.lookup(key) || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        imgStream.pipe(res);
    } else {
      throw new Error('Error get image');
    }
  },
};
