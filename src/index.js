require('dotenv').config();

const { startVideoConsumer } = require('./consumers/video.consumer');

console.log('WebM to MP4 service starting...');
console.log('STEP 1 ==> IN INDEX FILE');


startVideoConsumer();