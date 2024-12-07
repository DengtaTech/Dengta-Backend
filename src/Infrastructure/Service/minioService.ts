import { Readable } from 'stream';
import {
  minioClient,
  avatarBucket,
  footprintBucket,
} from '../../Database/FileServer/minioClient.js';
const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;
export const minioService = {
  uploadAvatar: async (
    userId: string,
    sourceFile: Express.Multer.File,
  ): Promise<string | null> => {
    try {
      const exists = await minioClient.bucketExists(avatarBucket);
      if (!exists) {
        throw new Error('Bucket does not exist');
      }
      const fileExtension = sourceFile.mimetype.split('/')[1];
      const filename = `${userId}-avatar.${fileExtension}`;
      await minioClient.putObject(
        avatarBucket,
        filename,
        sourceFile.buffer,
        sourceFile.size,
        {
          'Content-Type': sourceFile.mimetype,
        },
      );
      const permanentURL = `${BACKEND_DOMAIN}/image/${avatarBucket}/${filename}`;
      return permanentURL;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
  uploadFootprintHeadImg: async (
    footprintId: string,
    sourceFile: Express.Multer.File,
  ): Promise<string | null> => {
    try {
      const exists = await minioClient.bucketExists(footprintBucket);
      if (!exists) {
        throw new Error('Bucket does not exist');
      }
      const fileExtension = sourceFile.mimetype.split('/')[1];
      const filename = `${footprintId}-footprint-head-img.${fileExtension}`;
      await minioClient.putObject(
        footprintBucket,
        filename,
        sourceFile.buffer,
        sourceFile.size,
        {
          'Content-Type': sourceFile.mimetype,
        },
      );
      const permanentURL = `${BACKEND_DOMAIN}/image/${footprintBucket}/${filename}`;
      return permanentURL;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
  uploadFootprintContentImg: async (
    footprintId: string,
    sourceFile: Express.Multer.File,
  ): Promise<string | null> => {
    try {
      const exists = await minioClient.bucketExists(footprintBucket);
      if (!exists) {
        throw new Error('Bucket does not exist');
      }
      const fileExtension = sourceFile.mimetype.split('/')[1];
      const timestamp = Date.now();
      const filename = `${footprintId}-${timestamp}.${fileExtension}`;
      await minioClient.putObject(
        footprintBucket,
        filename,
        sourceFile.buffer,
        sourceFile.size,
        {
          'Content-Type': sourceFile.mimetype,
        },
      );
      const permanentURL = `${BACKEND_DOMAIN}/image/${footprintBucket}/${filename}`;
      return permanentURL;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
  getPresignedImgUrl: async (
    bucketName: string,
    filename: string,
  ): Promise<string | null> => {
    try {
      // the first part of the path is the bucket name, may have multiple parts
      const presignedUrl = await minioClient.presignedGetObject(
        bucketName,
        filename,
        24 * 60 * 60,
      );
      return presignedUrl;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
  getImg: async (bucketName: string, key: string): Promise<Readable | null> => {
    try {
      const stream = await minioClient.getObject(bucketName, key);
      return stream;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
};
