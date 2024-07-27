import * as Minio from 'minio';

const minioAvatarClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_AVATAR_ACCESS_KEY as string,
  secretKey: process.env.MINIO_AVATAR_SECRET_KEY as string,
});

const avatarBucket = process.env.MINIO_AVATAR_BUCKET as string;

async function uploadAvatar(
  userId: string,
  sourceFile: Express.Multer.File,
): Promise<string | null> {
  try {
    const exists = await minioAvatarClient.bucketExists(avatarBucket);
    if (!exists) {
      throw new Error('Bucket does not exist');
    }
    const filename = `${userId}-avatar`;
    await minioAvatarClient.putObject(
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
}

async function getPresignedAvatarUrl(filename: string): Promise<string | null> {
  try {
    const presignedUrl = await minioAvatarClient.presignedGetObject(
      avatarBucket,
      filename,
      24 * 60 * 60,
    );
    return presignedUrl;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

export default {
  uploadAvatar,
  getPresignedAvatarUrl,
};
