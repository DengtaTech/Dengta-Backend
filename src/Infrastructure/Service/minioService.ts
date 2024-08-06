import {
  minioClient,
  avatarBucket,
} from '../../Database/FileServer/minioClient.js';

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
      return filename;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
  getPresignedAvatarUrl: async (filename: string): Promise<string | null> => {
    try {
      // the first part of the path is the bucket name, may have multiple parts
      const presignedUrl = await minioClient.presignedGetObject(
        avatarBucket,
        filename,
        24 * 60 * 60,
      );
      return presignedUrl;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },
};
