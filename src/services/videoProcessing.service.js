const path = require('path');
const fs = require('fs');

const {
  downloadFileFromS3,
  uploadFileToS3,
  // deleteFileFromS3,
} = require('./s3.service');

const { convertWebmToMp4 } = require('./ffmpeg.service');
const { updateProcess } = require('./updateProcess.service');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const getMp4Key = (webmKey) => webmKey.replace('.webm', '.mp4');

const removeLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const processSingleVideo = async (webmKey, type) => {
  const fileName = path.basename(webmKey);
  const mp4FileName = fileName.replace('.webm', '.mp4');

  const inputDir = './temp/input';
  const outputDir = './temp/output';

  ensureDir(inputDir);
  ensureDir(outputDir);

  const inputPath = `${inputDir}/${type}-${fileName}`;
  const outputPath = `${outputDir}/${type}-${mp4FileName}`;

  const mp4Key = getMp4Key(webmKey);

  await downloadFileFromS3(inputPath, webmKey);

  await convertWebmToMp4(inputPath, outputPath);

  await uploadFileToS3(outputPath, mp4Key);

  removeLocalFile(inputPath);
  removeLocalFile(outputPath);

  return mp4Key;
};

const processVideo = async (payload) => {
  const { responseId, questionId, webcamKey, screenKey } = payload;

  const webcamMp4Key = await processSingleVideo(webcamKey, 'webcam');
  const screenMp4Key = await processSingleVideo(screenKey, 'screen');

  await updateProcess({
    responseId,
    questionId,
    webcamMp4Key,
    screenMp4Key,
  });

  // Delete original webm files from S3 later if required
  // await deleteFileFromS3(webcamKey);
  // await deleteFileFromS3(screenKey);

  console.log('Video processing completed successfully');

  return {
    responseId,
    questionId,
    webcamMp4Key,
    screenMp4Key,
  };
};

module.exports = {
  processVideo,
};