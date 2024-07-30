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
      const filename = `${userId}-avatar`;
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
