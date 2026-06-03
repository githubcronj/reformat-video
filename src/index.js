require("dotenv").config();

const { startVideoConsumer } = require("./consumers/video.consumer");

startVideoConsumer();
