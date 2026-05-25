const { Consumer } = require('sqs-consumer');

const {
  processVideo,
} = require('../services/videoProcessing.service');

const app = Consumer.create({
  queueUrl: process.env.AWS_WEBM_TO_MP4_QUEUE,

  handleMessage: async (message) => {
    console.log('Message', message);

    const payload = JSON.parse(message.Body);

    console.log('Parsed Payload', payload);

    await processVideo(payload);

    console.log('video processed and updated');
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
  app.start();
};

module.exports = {
  startVideoConsumer,
};