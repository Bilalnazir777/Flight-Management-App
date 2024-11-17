// @ts-check
const redis = require("redis");
const config = require("../config");

const isRedisGetOrSetEnabled = () => {
  const getEnabled = config.redis.enableUserGet;

  const setEnabled = config.redis.enableUserSet;

  return getEnabled || setEnabled;
};

class RedisGlobal {
  static #instance;

  constructor() {
    if (!RedisGlobal.#instance) {
      console.log("*** Connecting with redis => Valkey ***");
      const r = config.redis;

      if (isRedisGetOrSetEnabled()) {
        this.db = redis.createClient({
          url: `redis://${r.username}:${r.password}@${r.host}:${r.port}/${r.database}`,
        });

        this.db
          .connect()
          .then(() => {
            console.log("Connected successfully with Valkey");
          })
          .catch((err) => {
            console.error(`Error while connecting to Redis Valkey: ${err}`);
          });

        this.db.on("error", (err) => {
          console.error(`Error thrown from Redis: ${err}`);
        });

        this.db.on("end", () => {
          console.error("connection with Redis has been closed!");
        });

        this.db.on("reconnecting", () => {
          console.error("trying to reconnect with Redis...");
        });
      } else {
        console.log("Enable the Redis to proceed, Skipping Redis connection..");
      }

      RedisGlobal.#instance = this;
    }

    return RedisGlobal.#instance;
  }

  static getInstance() {
    if (!RedisGlobal.#instance) {
      RedisGlobal.#instance = new RedisGlobal();
    }
    return RedisGlobal.#instance;
  }
}

const instance = RedisGlobal.getInstance();

exports.redis = Object.freeze(instance);
