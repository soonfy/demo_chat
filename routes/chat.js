var express = require('express');
var router = express.Router();

const socket = require('socket.io');

router.chat = (server) => {
  let io = socket.listen(server);

  io.on('connection', (socket) => {
    socket.emit('open');
    console.log('[server] client conn.');

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