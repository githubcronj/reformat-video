const { Consumer } = require("sqs-consumer");

const { processVideo } = require("../services/videoProcessing.service");

const app = Consumer.create({
  queueUrl: process.env.AWS_WEBM_TO_MP4_QUEUE,
  waitTimeSeconds: 20,

  handleMessage: async (message) => {
    const payload = JSON.parse(message.Body);

    await processVideo(payload);
  },
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

const startVideoConsumer = () => {
  app.start();
};

module.exports = {
  startVideoConsumer,
};
