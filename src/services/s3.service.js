const AWS = require('aws-sdk');
const fs = require('fs');

const ACCESS = process.env.AWS_ACCESS_KEY_ID;
const SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ACCESS,
  secretAccessKey: SECRET,
  region: process.env.AWS_REGION,
});

const downloadFileFromS3 = (localPath, s3Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
    };

    console.log('Downloading from S3:', params);

    const file = fs.createWriteStream(localPath);

    const stream = s3
      .getObject(params)
      .createReadStream()
      .pipe(file);

    stream.on('finish', () => {
      console.log('Downloaded Successfully:', localPath);

      resolve(localPath);
    });

    stream.on('error', (err) => {
      console.log('S3 Download Error:', err);

      reject(err);
    });
  });
};

const uploadFileToS3 = (localPath, s3Key) => {
  return new Promise((resolve, reject) => {
    let fileContent;

    try {
      fileContent = fs.readFileSync(localPath);
    } catch (err) {
      return rej({ code: 500, message: err });
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'video/mp4',
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log('S3 Upload Error:', err);

        return reject(err);
      }

      console.log('File uploaded successfully:', data,data.Location);

      resolve(data);
    });
  });
};

// for not dont use it
const deleteFileFromS3 = (s3Key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log('S3 Delete Error:', err);

        return reject(err);
      }

      console.log('File deleted successfully:', s3Key);

      resolve(data);
    });
  });
};


module.exports = {
  downloadFileFromS3,
  uploadFileToS3,
  deleteFileFromS3
};