const config = require("../config");
exports.connectwithMongoDB = () => {
  const mongoose = require("mongoose");

  const mongoURI = `mongodb://${config.mongoDb.username}:${config.mongoDb.password}@${config.mongoDb.host}:${config.mongoDb.port}/${config.mongoDb.databaseName}?authSource=admin`;

  mongoose
    .connect(mongoURI)
    .then(async () => {
      console.log("server has been connected to Mongodb");
    })
    .catch((err) => {
      console.error("Error while connecting to Mongodb:", err);
    });
};
