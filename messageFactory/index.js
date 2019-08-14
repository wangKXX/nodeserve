let factory = [];

function addSocket(socket, options) {
  const flag = factory.filter(item => item.userId === options.userId);
  if (!flag.length) {
    const config = {
      socket,
      userId: options.userId
    }
    factory.push(config);
  }
}

function removeSocket(userId) {
  factory = factory.filter(item => {
    return item.userId !== userId;
  })
}

// 系统推送消息
function sendAll(mesg) {
  factory.forEach(item => {
    item.socket.send(mesg);
  })
}

// 私聊模式
function sendToOne(data) {
  const { mesg } = data;
  for (let i = 0; i < factory.length; i++) {
    if (factory[i].userId === mesg.user.id) {
      factory[i].socket.send(JSON.stringify(mesg));
    }
  }
}

// 全部断开
function closeAll() {
  factory = [];
}

module.exports = {
  addSocket,
  sendToOne,
  closeAll,
  sendAll,
  removeSocket
}