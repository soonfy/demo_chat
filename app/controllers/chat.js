/**
 *  chat controllers
 */

const socket = require('socket.io');
const moment = require('moment');

let chat = (server) => {
  let io = socket.listen(server);

  let rooms = {
    'Node.js': [],
    'JavaScript': [],
    'Java': [],
    'Python': [],
    '自然语言处理': [],
    '大数据': []
  };
  let users = [];

  io.on('connection', (socket) => {

    socket.on('online', (user) => {
      let index = 1;
      while (users.includes(user)) {
        user = index === 1 ? user : user.slice(0, user.lastIndexOf('-'));
        user = [user, index].join('-');
        index++;
      }
      socket.user = user;
      users.push(user);

      let data = {
        type: '系统消息',
        user: '系统消息',
        text: user,
        users,
        rooms,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.emit('online', data);
    });

    socket.on('join', (message) => {
      let {
        room,
        user
      } = message;
      if (!rooms[room].includes(user)) {
        rooms[room].push(user);
      }
      let data = {
        type: '系统消息',
        user: '系统消息',
        room,
        text: user,
        users: rooms[room],
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.join(room, () => {
        io.to(room).emit('join', data);
      });
    });

    socket.on('leave', (message) => {
      let {
        room,
        user
      } = message;
      if (rooms[room].includes(user)) {
        rooms[room].splice(rooms[room].indexOf(user), 1);
      }
      let data = {
        type: '系统消息',
        user: '系统消息',
        room,
        text: user,
        users,
        rooms,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.join(room, () => {
        io.to(room).emit('leave', data);
      });
    });

    socket.on('disconnect', () => {
      if (users.includes(socket.user)) {
        users.splice(users.indexOf(socket.user), 1);
        let data = {
          type: '系统消息',
          user: '系统消息',
          text: socket.user,
          users,
          date: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        socket.broadcast.emit('offline', data);
      }
    });

    socket.on('chat', (message) => {
      let data = {
        type: '用户消息',
        user: message.user,
        text: message.text,
        users,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      io.emit('chat', data);
    });
  })
}

module.exports = chat;
