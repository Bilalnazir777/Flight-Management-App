// server.js
const { Kafka } = require("kafkajs");
const WebSocket = require("ws");

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
console.log("Socket server is running on this url ws://localhost:8080");

// Keep track of WebSocket clients
const clients = [];

// When a new client connects, add it to the list
wss.on("connection", (ws) => {
  console.log("New Web socket client is added to list");
  clients.push(ws);

  // Remove client from list on disconnect
  ws.on("close", () => {
    clients.splice(clients.indexOf(ws), 1);
  });
});

// Set up Kafka
const kafkaBroker = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const kafkaDataConsumer = kafkaBroker.consumer({ groupId: "websocket-group" });

const StartSocketServer = async () => {
  await kafkaDataConsumer.connect();
  await kafkaDataConsumer.subscribe({
    topic: "flight_entry_created",
    fromBeginning: true,
  });
  await kafkaDataConsumer.subscribe({
    topic: "flight_entry_update",
    fromBeginning: true,
  });

  // Consume messages and forward them to WebSocket clients
  await kafkaDataConsumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = message.value.toString();
      console.log(`Message receive from topic of Kafka ${topic}: ${payload}`);

      // Send the payload to all connected WebSocket clients
      clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ topic, payload }));
        }
      });
    },
  });
};

StartSocketServer().catch(console.error);
