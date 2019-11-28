const io = require('socket.io');
let ws = null;

function listener(_serve) {
  ws = io.listen(_serve);
  ws.on('connect', socket => {
    logger.log('info', socket);
  });
}

module.exports = {
  listener
}