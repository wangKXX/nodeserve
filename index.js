
const webSocket = require('ws');
const factory = require('./messageFactory');
const seviceStart = require('./sevice');
const webSocketService = webSocket.Server;
const redisInit = require('./redis');
const api = require('./mysql');
const redisTools = require('./redis/tools');

seviceStart();
redisInit();
const wss = new webSocketService({
  port: 3030
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(item => {
      if (item.readyState === webSocket.OPEN && item === ws) {
        // 发布给所有订阅者,维护socket链接，每个客户端维护一个链接，通过用户的ID区分
        data = JSON.parse(data);
        if (data.type === 'join') {
          factory.addSocket(item, data);
        } else if (data.type === 'ping') {
          item.send(JSON.stringify({type: 'pong', userId: data.userId}));
        } else if (data.type === 'mesg') {
          factory.sendToOne(data);
        } else if (data.type === 'logout') {
          factory.removeSocket(data.userId);
        } else if (data.type === 'add') {
          factory.sendToOne(data);
        } else if (data.type === 're_add') {
          const { mesg } = data;
          const { re: { id: fid } } = mesg; // 同意添加的本身
          const { user: { id }} = mesg; // 请求者
          const messageRequest = {
            type: 'addSucess',
            re: mesg.re,
            user: mesg.user,
            mesg: {
              time: new Date(),
              content: '对方已同意您的添加请求，你们现在可以开始聊天了'
            }
          };
          const message = {
            type: 'addSucess',
            re: mesg.user,
            user: mesg.re,
            mesg: {
              time: new Date(),
              content: '您已同意对方的添加请求，你们现在可以开始聊天了'
            }
          };
          /**
           * 收取到同意添加的消息后
           * 1.建立数据关联
           * 2.查询redis回去打招呼信息，发送给请求者，同时给接收者发送同意固定用语
           */
          api.addFriend([id, fid]).then(res => {
            api.addFriend([fid, id]).then(resInner => {
              // 确定双方关系建立成功
              factory.sendToOne({mesg: messageRequest, type: 'addSucess'});
              factory.sendToOne({mesg: message, type: 'addSucess'});
              redisTools.del(`add_${id}`); // 删除redis 缓存
            })
          });
        }
      }
    })
  });
});