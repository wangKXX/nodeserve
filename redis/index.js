const redis = require('redis');

function redisInit() {
  global.redisClient = redis.createClient(6379, '127.0.0.1');
  redisClient.on('error', error => {
    console.error(error, '-----> error');
    // TODO error deal
  });
  redisClient.on('connect', function() {
    console.log('redis connect success');
  });
}
module.exports = redisInit;