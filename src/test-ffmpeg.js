const path = require('path');
const { convertWebmToMp4 } = require('../src/services/ffmpeg.service');

const run = async () => {
  try {
    const inputPath = path.join(__dirname, './temp/input/sample.webm');
    const outputPath = path.join(__dirname, './temp/output/sample.mp4');

    console.log('Converting...');
    console.log('Input:', inputPath);
    console.log('Output:', outputPath);

    await convertWebmToMp4(inputPath, outputPath);

    console.log('Conversion test completed successfully');
  } catch (error) {
    console.error('Conversion test failed:', error);
  }
};

run();