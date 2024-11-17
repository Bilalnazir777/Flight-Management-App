const express = require("express");
const dotenv = require("dotenv");

const { init } = require("./kafka/producer");
const cors = require("cors");

const { connectwithMongoDB } = require("./mongo");
const flightRoutes = require("./src/routes/flightRoutes");

const userRoutes = require("./src/routes/userRoutes");
const { kafkaBrokerClient } = require("./kafka/kafka-init");
dotenv.config();

const app = express();

app.use(express.json());
var corsOptions = {
  origin: "*",
  credentials: true,
};
app.use(cors(corsOptions));
connectwithMongoDB();

init();
require("./jobs/flightJob");

app.use("/api/flights", flightRoutes);
app.use("/api/users", userRoutes);
process.on("SIGTERM", async () => {
  try {
    console.log("starting graceful shutdown...");

    await kafkaBrokerClient.disconnectProducer();

    console.log("shutdown completed...");
    process.exit(0);
  } catch (error) {
    logger.error("error in graceful shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  try {
    console.warn("graceful shutdown...");

    await kafkaBrokerClient.disconnectProducer();

    console.warn(" shutdown completed...");
    process.exit(0);
  } catch (error) {
    logger.error("error in graceful shutdown:", error);
    process.exit(1);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
