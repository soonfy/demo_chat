const socket = require('socket.io');

let chat = (server) => {
  let io = socket.listen(server);

  io.on('connection', (socket) => {
    console.log(`a user connected.`);
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
    socket.on('chat message', function (msg) {
      let data = Math.random() >= 0.5 ? {
        name: 'owner',
        text: msg
      } : {
        name: 'other',
        text: msg
      }
      io.emit('chat message', data);
    });
  })
}

module.exports = chat;
