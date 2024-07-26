import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'minio.dengta.org',
  port: 9000,
  useSSL: true,
  accessKey: 'bUNV93ugH7fdBFzIiUZS',
  secretKey: '6Qbr1fsQFR46NOAP4ePmXUt0bFi7O9Uf5oOJYrOB',
});

async function uploadFile() {
  // File to upload
  const sourceFile = './test-file.txt';

  // Destination bucket
  const bucket = 'user-avatar-test';

  // Destination object name
  const destinationObject = 'my-test-file.txt';

  // Check if the bucket exists
  // If it doesn't, create it
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (exists) {
      console.log('Bucket ' + bucket + ' exists.');
    } else {
      throw new Error('Bucket does not exist');
    //   await minioClient.makeBucket(bucket);
    //   console.log('Bucket ' + bucket + ' created in "us-east-1".');
    }

    // Set the object metadata
    const metaData = {
      'Content-Type': 'text/plain',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };

    // Upload the file with fPutObject
    // If an object with the same name exists,
    // it is updated with new data
    await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData);
    console.log(
      'File ' +
        sourceFile +
        ' uploaded as object ' +
        destinationObject +
        ' in bucket ' +
        bucket,
    );
  } catch (err) {
    console.error('Error:', err);
  }
}

// Call the function to upload the file
uploadFile();