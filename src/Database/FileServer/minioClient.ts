import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: 9000,
  useSSL: true,
  accessKey: process.env.MINIO_AVATAR_ACCESS_KEY as string,
  secretKey: process.env.MINIO_AVATAR_SECRET_KEY as string,
});

const avatarBucket = process.env.MINIO_AVATAR_BUCKET as string;

export { minioClient, avatarBucket };
