const redisTools = require('../redis/tools');
const uuidV4 = require('uuid/v4');
let factory = {};
async function addSocket(socket, options) {
  // 有用户连接进来是查看是否有需要推送的消息
  factory[options.userId] = socket;
  logger.log('info', `${options.userId} online`);
  let res = await redisTools.lrange(options.userId);
  res.forEach(item => {
    socket.send(item);
  });
  // 推送完历史消息清空
  redisTools.del(options.userId);
}

function removeSocket(userId) {
  logger.log('info', `${userId} outline`);
  Reflect.deleteProperty(factory, userId);
}

// 系统推送消息
function sendAll(mesg) {
  factory.values().forEach(item => {
    item.socket.send(mesg);
  })
}

// 私聊模式
function sendToOne(data) {
  const { mesg: { user: { id }, type, re: { id: rId }} } = data;
  if (type === 'add') {
    redisTools.set(`add-${id}`, rId, 60 * 60 * 24 * 7); // 设置七天有效时间，请求者id
  }
  if (checkISOnline(id)) {
    factory[id].send(JSON.stringify(data.mesg));
  } else {
    // 用户已经离线的状态，将消息存储在redis中
    redisTools.rPush(id, JSON.stringify(data.mesg));
  }
}
async function sendAddFriendMesg(id, fid) {
  // 用请求者id(id)去获取redis打招呼信息
  // const res = await redisTools.get(`add-${id}`)
  if (checkISOnline(id)) {
    factory[id].send(JSON.stringify(data.mesg));
  } else {
    // 用户已经离线的状态，将消息存储在redis中
    redisTools.rPush(id, JSON.stringify(data.mesg));
  }
}
// 全部断开
function closeAll() {
  factory = {};
}

// 检查在线状态
function checkISOnline(userId) {
  return factory[userId];
}

module.exports = {
  addSocket,
  sendToOne,
  closeAll,
  sendAll,
  removeSocket,
  checkISOnline,
  sendAddFriendMesg
}