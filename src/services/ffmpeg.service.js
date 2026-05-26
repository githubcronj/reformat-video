const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegPath);

const runFfmpeg = (inputPath, outputPath, options) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(options)
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('stderr', (line) => {
        console.log('FFmpeg stderr:', line);
      })
      .on('end', () => {
        console.log('Conversion completed:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.log('FFmpeg Error:', err.message);
        reject(err);
      })
      .run();
  });
};

const convertWebmToMp4 = async (inputPath, outputPath) => {
  console.log("STEP 7 IN convertWebmToMp4")
   try {
    console.log('Trying fast remux...');

    return await runFfmpeg(inputPath, outputPath, [
      '-c:v copy',
      '-c:a aac',
      '-movflags faststart',
    ]);
  } catch (error) {
    console.log('Fast remux failed. Trying re-encode...');

    return runFfmpeg(inputPath, outputPath, [
      '-c:v libx264',
      '-c:a aac',
      '-preset veryfast',
      '-crf 30',
      '-vf fps=30',
      '-movflags faststart',
      '-threads 0',
    ]);
  }
};

module.exports = {
  convertWebmToMp4,
};