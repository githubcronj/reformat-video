const path = require('path');
const fs = require('fs');

const {
  downloadFileFromS3,
  uploadFileToS3,
  // deleteFileFromS3,
} = require('./s3.service');

const { convertWebmToMp4 } = require('./ffmpeg.service');
const { updateProcess } = require('./api.service');

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
  console.log('STEP 5 ==> IN PROCCESSSINGLEVIDEO FILE');

  const fileName = path.basename(webmKey); // file = webkey
  console.log("in ProccessSingleVideo webmkey", webmKey)
  const mp4FileName = fileName.replace('.webm', '.mp4'); 

  const inputDir = './src/temp/input';
  const outputDir = './src/temp/output';

  ensureDir(inputDir); //any file exist or not clean directory
  ensureDir(outputDir);

  const inputPath = `${inputDir}/${type}-${fileName}`;
  const outputPath = `${outputDir}/${type}-${mp4FileName}`;

  const mp4Key = getMp4Key(webmKey);

  await downloadFileFromS3(inputPath, webmKey);

  await convertWebmToMp4(inputPath, outputPath);

  // await removeLocalFile(inputPath); make it async functon

  await uploadFileToS3(outputPath, mp4Key); // mp4filename

  // removeLocalFile(inputPath);
  removeLocalFile(outputPath); //add aw

  return mp4Key; //mp4filename
};

const processVideo = async (payload) => {
  const { responseId, questionId, webcamKey, screenKey } = payload;
  console.log('STEP 3 ==> IN PROCEESSVIDEO FILE', payload);


  const webcamMp4Key = await processSingleVideo(webcamKey, 'webcam'); // send both 
  const screenMp4Key = await processSingleVideo(screenKey, 'screen');


  console.log('STEP 8 ==> IN going to api FILE', webcamMp4Key,screenMp4Key);

  await updateProcess({
    responseId,
    questionId,
    webcamMp4Key,
    screenMp4Key,
  });

  // Delete original webm files from S3 later if required // check delete all togethere
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