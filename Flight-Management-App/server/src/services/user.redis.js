const redisClient = require("./../../redis/redis-client");

const config = require("./../../config");

//creating user in redis database
exports.create_user = async ({ id, username, password, role }) => {
  try {
    let redisKey = `${config.redis.userPrefix}:${id}`;
    const result = await redisClient.setJSONInRedis(
      redisKey,
      {
        id,
        username,
        password,
        role,
      },
      redisClient.isRedisUserSetEnabled()
    );

    if (result != "OK") {
      throw new Error(`write operation failed into Redis for key: ${redisKey}`);
    }
  } catch (error) {
    console.error(`Error thrown in service user.redis create_user : ${error}`);
    throw error;
  }
};

//checking that user already exist or not in redis
exports.is_exists = async (id) => {
  try {
    return redisClient.existsInRedis(
      `${config.redis.userPrefix}:${id}`,
      redisClient.isRedisUserGetEnabled()
    );
  } catch (error) {
    console.error(`Error thrown in service user.redis is_exists : ${error}`);
    throw error;
  }
};

//getting specific user from redis
exports.get_user_by_id = async (id) => {
  try {
    const user = await redisClient.getJSONInRedis(
      `${config.redis.userPrefix}:${id}`,
      redisClient.isRedisUserGetEnabled()
    );
    if (!user) {
      throw new Error("User not exists");
    }
    return user;
  } catch (error) {
    console.error(
      `Error thrown in service user.redis get_user_by_id : ${error}`
    );
    throw error;
  }
};
