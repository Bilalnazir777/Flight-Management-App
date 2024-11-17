const { kafkaBrokerClient } = require("./kafka-init");

exports.init = async () => {
  try {
    await kafkaBrokerClient.connectKafkaProducer();
  } catch (error) {
    console.error(`Error while connecting Kafka Producer: ${error.message}`);
  }
};

exports.publishKafkaMessage = async (topic, message) => {
  try {
    await kafkaBrokerClient.produceKafkaMessage(topic, message);
  } catch (error) {
    console.error(error);
  }
};
