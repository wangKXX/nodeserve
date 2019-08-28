const redis = require('redis');
const linkList = {
  // 尾部追加
  rPush(key, value) {
    redisClient.rpush(key, value, redis.print);
  },
  // 头部添加
  lPush(key, value) {
    redisClient.lpush(key, value, redis.print);
  },

  // set
  set(key, value, time) {
    redisClient.set(key, value, 'EX', time);
  },
  lrange(key, start = 0, end = -1, cb) {
    return new Promise((resolve, reject) => {
      redisClient.lrange(key, start, end, function(err, data){
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    })
  },
  // 设置有效期
  expire(key, time) {
    redisClient.expire(key, time);
  },

  // 按key删除
  del(key) {
    new Promise((resolve, reject) => {
      redisClient.del(key, (err, replay) => {
        if (err) reject(err);
        resolve(replay);
      })
    });
  },

  get(key) {
    new Promise((resolve, reject) => {
      redisClient.get(key, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      })
    })
  }
}

module.exports = linkList;