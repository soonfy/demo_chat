/**
 *  chat controllers
 */

const socket = require('socket.io');
const moment = require('moment');

let chat = (server) => {
  let io = socket.listen(server);

  let STATUS = {
    HALL: 'hall',
    ROOM: 'room',
    USER: 'user'
  };

  let rooms = {
    'Node.js': [],
    'JavaScript': [],
    'Java': [],
    'Python': [],
    '自然语言处理': [],
    '大数据': []
  };
  let allusers = [];

  io.on('connection', (socket) => {

    // 用户登录聊天室
    socket.on('online', (message) => {
      let {
        user
      } = message, index = 1;
      while (allusers.includes(user)) {
        user = index === 1 ? user : user.slice(0, user.lastIndexOf('-'));
        user = [user, index].join('-');
        index++;
      }
      socket.user = user;
      allusers.push(user);
      let data = {
        type: '系统消息', // 消息类型
        user: user, // 消息来源
        text: user, // 消息内容
        allusers, // 用户信息
        rooms, // 房间信息
        date: moment().format('YYYY-MM-DD HH:mm:ss') // 时间戳
      };
      console.log(`${user} online.`);
      io.emit('online', data);
    });

    // 用户加入房间
    socket.on('join', (message) => {
      let {
        room,
        user
      } = message;
      socket.room = room;
      if (!rooms[room].includes(user)) {
        rooms[room].push(user);
      }
      let data = {
        type: '系统消息',
        user: user,
        room, // 房间名称
        text: user,
        room,
        users: rooms[room], // 房间用户信息
        allusers,
        rooms,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.join(room, () => {
        console.log(`${user} join ${room}.`);
        socket.broadcast.emit('flush', data);
        io.to(room).emit('join', data);
      });
    });

    socket.on('leave', (message) => {
      let {
        room,
        user
      } = message;
      socket.room = null;
      if (rooms[room].includes(user)) {
        rooms[room].splice(rooms[room].indexOf(user), 1);
      }
      let data = {
        type: '系统消息',
        user: user,
        room,
        text: user,
        room,
        users: rooms[room],
        allusers,
        rooms,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.leave(room, () => {
        console.log(`${user} leave ${room}.`);
        socket.broadcast.emit('flush', data);
        socket.emit('leave', data);
        io.to(room).emit('leave', data);
      });
    });

    socket.on('disconnect', () => {
      let user = socket.user,
        room = socket.room;
      if (allusers && allusers.includes(user)) {
        allusers.splice(allusers.indexOf(user), 1);
      }
      if (rooms[room] && rooms[room].includes(user)) {
        rooms[room].splice(rooms[room].indexOf(user), 1);
      }
      let data = {
        type: '系统消息',
        user: user,
        text: user,
        room,
        users: rooms[room],
        allusers,
        rooms,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      socket.broadcast.emit('offline', data);
    });

    socket.on('chat', (message) => {
      let {user, text, room, chatTo} = message;
      let data = {
        type: '用户消息',
        user,
        text,
        room,
        chatTo,
        date: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      if (chatTo.type === STATUS.HALL) {
        io.emit('chat', data);
      } else if (chatTo.type === STATUS.ROOM) {
        io.to(room).emit('chat', data);
      } else {
        let socketid;
        let sockets = io.sockets.sockets;
        for (var id in sockets) {
          if (sockets[id].user === chatTo.user) {
            socketid = id;
          }
        }
        io.to(socketid).emit('chat', data);
        socket.emit('chat', data);
      }
    });
  })
}

module.exports = chat;
