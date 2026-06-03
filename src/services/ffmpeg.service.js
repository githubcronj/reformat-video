const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

const runFfmpeg = (inputPath, outputPath, options) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(options)
      .output(outputPath)
      .on("start", (cmd) => {})
      .on("stderr", (line) => {})
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};

const convertWebmToMp4 = async (inputPath, outputPath) => {
  try {
    return await runFfmpeg(inputPath, outputPath, [
      "-c:v copy",
      "-c:a aac",
      "-movflags faststart",
    ]);
  } catch (error) {
    return runFfmpeg(inputPath, outputPath, [
      "-c:v libx264",
      "-c:a aac",
      "-preset veryfast",
      "-crf 30",
      "-vf fps=30",
      "-movflags faststart",
      "-threads 0",
    ]);
  }
};

module.exports = {
  convertWebmToMp4,
};
