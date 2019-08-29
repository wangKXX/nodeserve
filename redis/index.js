const redis = require('redis');
const winston = require('winston');

function redisInit() {
  global.redisClient = redis.createClient(6379, '127.0.0.1');
  redisClient.on('error', error => {
    winston.log('error', error);
    // TODO error deal
  });
  redisClient.on('connect', function() {
    winston.log('info', 'redis connect sucess!');
  });
}
module.exports = redisInit;