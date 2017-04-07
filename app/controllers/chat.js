/**
 *  chat controllers
 */

const socket = require('socket.io');
const moment = require('moment');

let chat = (server) => {
  let io = socket.listen(server);
  let nsp = io.sockets;
  io.on('connection', (socket) => {
    console.log(`a user connected.`);
    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
    socket.on('chat message', function (msg) {
      console.log(msg);
      let data = Math.random() >= 0.5 ? {
        name: 'owner',
        text: msg,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      } : {
        name: 'other',
        text: msg,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      io.emit('chat message', data);
    });
  })
}

module.exports = chat;
