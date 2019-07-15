const io = require('socket.io');
let ws = null;

function listener(_serve) {
  ws = io.listen(_serve);
  ws.on('connect', socket => {
    console.log(socket, 'success');
  });
}

module.exports = {
  listener
}