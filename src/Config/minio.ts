import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'minio.dengta.org',
  port: 9000,
  useSSL: true,
  accessKey: 'opuF1noXbmJRx4dI3FaB',
  secretKey: 'FiSYbCOzTCxzxi5ntpkb0Dh5KgKdESxgJEXuco6T',
});


export default minioClient;
