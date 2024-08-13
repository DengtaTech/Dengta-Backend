import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY as string,
  secretKey: process.env.MINIO_SECRET_KEY as string,
});

const avatarBucket = process.env.MINIO_AVATAR_BUCKET as string;
const footprintBucket = process.env.MINIO_FOOTPRINT_BUCKET as string;

export { minioClient, avatarBucket, footprintBucket };
