/**
 *  socket.io
 */
const socket = require('socket.io');

const chat = (server) => {
  let io = socket.listen(server);

  io.on('connection', (socket) => {
    console.log('[server] client conn.');
    socket.emit('open');

    socket.on('msg', (msg) => {
      console.log('[server]', msg);
      socket.emit('system', `[emit] ${msg}`);
      socket.broadcast.emit('system', `[broadcast] ${msg}`);
    })

    socket.on('disconnect', () => {
      socket.emit('system', `[emit] disconnect`);
      socket.broadcast.emit('system', `[broadcast] disconnect`);
    })
  })
}

module.exports = chat;