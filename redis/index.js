const redis = require(redis);
global.redisClient = redis.creatClient();

redisClient.on('error', error => {
  console.error(error, '-----> error');
  // TODO error deal
});