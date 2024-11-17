const { redis } = require("./redis-init");
const config = require("../config");

const isRedisUserGetEnabled = () => {
  const val = config.redis.enableUserGet;
  if (!val)
    console.log("Redis Write operation is not enabled. Skipping write.");
  return val;
};

const isRedisUserSetEnabled = () => {
  const val = config.redis.enableUserSet;
  if (!val)
    console.log("Redis Write operation is not enabled. Skipping write.");
  return val;
};

const setJSONInRedis = async (key, value, isCaching = false) => {
  if (!isCaching) return;
  return await redis.db.set(key, JSON.stringify(value));
};

const getJSONInRedis = async (key, isCaching = false) => {
  if (!isCaching) return;
  const result = await redis.db.get(key);
  return JSON.parse(result);
};

const delFromRedis = async (key, isCaching = false) => {
  if (!isCaching) return;
  return await redis.db.del(key);
};

const existsInRedis = async (key, isCaching = false) => {
  if (!isCaching) return;
  return await redis.db.exists(key);
};

module.exports = {
  isRedisUserGetEnabled,
  isRedisUserSetEnabled,
  setJSONInRedis,
  getJSONInRedis,
  delFromRedis,
  existsInRedis,
};
