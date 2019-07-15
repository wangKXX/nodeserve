// const express = require('express');
// const app = express();
// const io = require('./socket')
// const serve = app.listen(3000, () => console.log('Example app listening on port 3000!'));
// io.listener(serve);

const webSocket = require('ws');
const factory = require('./messageFactory');
const webSocketService = webSocket.Server;
const wss = new webSocketService({
  port: 3000
});

wss.on('connection', function connection(ws) {
  console.log('有链接', ws)
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
        }
      }
    })
  });
});