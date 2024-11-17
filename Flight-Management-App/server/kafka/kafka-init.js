const { Kafka } = require("kafkajs");
const config = require("../config");

class KafkaBrokerClient {
  static #instance = null;

  constructor() {
    this.isConnected = false;

    this.kafka = new Kafka({
      clientId: `${config.kafka.clientId}`,
      brokers: [`${config.kafka.host}:${config.kafka.port}`],
    });

    this.producer = this.kafka.producer();
  }

  async connectKafkaProducer() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log("Kafka Producer has been connected");
    } catch (error) {
      this.isConnected = false;
      console.error("Error while connecting Kafka Producer:", error.message);
    }
  }

  async disconnectKafkaProducer() {
    await this.producer.disconnect();
    this.isConnected = false;
    console.log("Kafka Producer has been disconnected");
  }

  static getInstance() {
    if (KafkaBrokerClient.#instance) return KafkaBrokerClient.#instance;

    KafkaBrokerClient.#instance = new KafkaBrokerClient();
    return KafkaBrokerClient.#instance;
  }

  async produceKafkaMessage(topic, message) {
    try {
      if (!this.isConnected) {
        console.error("Kafka producer is not connected");
      }

      const result = await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log(
        `Message has been sent successfully: ${JSON.stringify(result)}`
      );
    } catch (error) {
      console.error(`Error while sending message: ${error}`);
    }
  }
}

const instance = KafkaBrokerClient.getInstance();
exports.kafkaBrokerClient = instance;
