const { Consumer } = require('sqs-consumer');

const {
  processVideo,
} = require('../services/videoProcessing.service');

const app = Consumer.create({
  queueUrl: process.env.AWS_WEBM_TO_MP4_QUEUE,
  waitTimeSeconds: 20,

  handleMessage: async (message) => {
    console.log('Message', message);

    const payload = JSON.parse(message.Body);

    console.log('STEP 2.1 Parsed Payload', payload);

    await processVideo(payload);

    console.log('End - video processed and updated');
  },
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

const startVideoConsumer = () => {
  console.log('Video consumer started...');
  console.log('STEP 2 ==> IN CONSUMER FILE');

  app.start();
};

module.exports = {
  startVideoConsumer,
};