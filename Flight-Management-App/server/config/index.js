require("dotenv").config();

module.exports = {
  redis: {
    host: process.env.REDIS_DB_HOST || "localhost",
    port: process.env.REDIS_DB_PORT || 6379,
    username: process.env.REDIS_DB_USERNAME || "default",
    password: process.env.REDIS_DB_PASSWORD || "secret",
    database: process.env.REDIS_DB_DATABASE || "0",
    enableUserGet: process.env.REDIS_DB_USER_GET_ENABLED === "true",
    enableUserSet: process.env.REDIS_DB_USER_SET_ENABLED === "true",
    userPrefix: process.env.REDIS_DB_USER_PREFIX || 1,
  },
  mongoDb: {
    host: process.env.MONGO_DATABASE_HOST || "localhost",
    port: process.env.MONGO_DATABASE_PORT || "27017",
    username: process.env.MONGO_DATABASE_USERNAME || "root",
    password: process.env.MONGO_DATABASE_PASSWORD || "secret",
    databaseName: process.env.MONGO_DATABASE_NAME || "pikkyflighttask",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "flightmanagementtaskofpikky",
  },
  kafka: {
    clientId: process.env.KAFKA_BROKER_CLIENT_ID || Date.now(),
    host: process.env.KAFKA_BROKER_HOST || "localhost",
    port: process.env.KAFKA_BROKER_PORT || 9092,
  },
  tasks: {
    createFlightInterval: process.env.CREATE_FLIGHT_TASK_INTERVAL || 10000,
    updateFlightInterval: process.env.UPDATE_FLIGHT_TASK_INTERVAL || 20000,
  },
};
