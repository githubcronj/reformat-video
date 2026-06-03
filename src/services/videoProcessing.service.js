const path = require("path");
const fs = require("fs");

const {
  downloadFileFromS3,
  uploadFileToS3,
  deleteFileFromS3,
} = require("./s3.service");

const { convertWebmToMp4 } = require("./ffmpeg.service");
const { updateProcess } = require("./api.service");

const removeFilesFromDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }

  const files = fs.readdirSync(dir);

  if (!files.length) {
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);

    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
};

const getMp4Key = (webmKey) => webmKey.replace(/\.webm$/i, ".mp4");

const removeLocalFile = async (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    console.log("Error removing local file:", filePath, err.message);
  }
};

const processSingleVideo = async (webmKey, type) => {
  console.log(
    "STEP 4 ==> IN PROCCESSSINGLEVIDEO FILE webmKey",
    webmKey,
    "type",
    type,
  );

  const localWebmFileName = path.basename(webmKey); // to get a only the WEBM file name and exclude s3 path
  const s3Mp4Key = getMp4Key(webmKey); // final MP4 path in S3

  const localInputDir = "./src/temp/input";
  const localOutputDir = "./src/temp/output";

  removeFilesFromDir(localInputDir);
  removeFilesFromDir(localOutputDir);

  const localWebmPath = path.join(
    localInputDir,
    `${type}-${localWebmFileName}`,
  );
  const localMp4Path = path.join(
    localOutputDir,
    `${type}-${path.basename(s3Mp4Key)}`,
  );

  await downloadFileFromS3(localWebmPath, webmKey);

  await convertWebmToMp4(localWebmPath, localMp4Path);

  await removeLocalFile(localWebmPath);

  await uploadFileToS3(localMp4Path, s3Mp4Key);

  await removeLocalFile(localMp4Path);

  return s3Mp4Key;
};

const processVideo = async (payload) => {
  const { responseId, questionId, webcamKey, screenKey } = payload;
  console.log("STEP 3 ==> IN PROCEESSVIDEO FILE", payload);

  const webcamMp4Key = await processSingleVideo(webcamKey, "webcam");
  const screenMp4Key = await processSingleVideo(screenKey, "screen");

  console.log(
    "STEP 8 ==> IN going to api FILE webcamMp4Key and screenMp4Key",
    webcamMp4Key,
    screenMp4Key,
  );

  await updateProcess({
    responseId,
    questionId,
    webcamMp4Key,
    screenMp4Key,
  });

  // Delete original webm files from S3 later if required
  await Promise.all([deleteFileFromS3(webcamKey), deleteFileFromS3(screenKey)]);

  console.log("Final - Video processing completed successfully");

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
