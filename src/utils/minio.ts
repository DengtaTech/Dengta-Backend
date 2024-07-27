import minioClient from "../Config/minio.js";

async function uploadFile(sourceFile, bucket, destinationObject) {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      throw new Error('Bucket does not exist');
    }
    await minioClient.fPutObject(bucket, destinationObject, sourceFile);
  } catch (err) {
    console.error('Error:', err);
  }
}

export {
  uploadFile
}
