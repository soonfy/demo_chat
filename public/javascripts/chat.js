$(() => {
  console.log('chat page document over.');

  let user = Cookies.get('uname').trim();
  let uroom;
  let STATUS = {
    HALL: 'hall',
    ROOM: 'room',
    USER: 'user'
  };
  let status = STATUS.HALL;
  let chatTo = {
    type: STATUS.HALL
  };

  // let socket = io('http://localhost:3000');
  let socket = io();
  let timeout = 1000 * 60 * 10;
  let last = new Date() - timeout;

  function scrollToBottom() {
    $('#content').scrollTop($('#content')[0].scrollHeight);
  }

  function flushRoomList(message) {
    let {
      rooms,
      allusers
    } = message;
    let roomsArr = Object.keys(rooms);
    $('#list').empty().append(`<div title="房间列表(${roomsArr.length}) - ${allusers.length}">房间列表(${roomsArr.length}) - ${allusers.length}</div>`);
    roomsArr.map((_room) => {
      $('#list').append(`<p data-type="room" name="${_room}" title="房间 ${_room}, 双击进入">${_room} - ${rooms[_room].length}</p>`)
    })
    $('[data-type="room"]').dblclick((e) => {
      let room = $(e.target).attr('name');
      let data = {
        room,
        user
      };
      status = STATUS.ROOM;
      uroom = room;
      chatTo.type = STATUS.ROOM;
      socket.emit('join', data);
    })
  }

  function flushUserList(message) {
    let {
      users,
      room
    } = message;
    $('#list').empty().append(`<div data-type="room" title="${room} - ${users.length}, 双击回到房间模式。">${room} - ${users.length} </div>`);
    $('#list').append(`<div data-type="leave" name="${room}" title="双击离开房间">离开房间</div>`);
    users.map((_user) => {
      $('#list').append(`<p data-type="user" name="${_user}" title="用户 ${_user}, 双击私信模式。">${_user}</p>`)
    })
    $('[data-type="leave"]').dblclick((e) => {
      let room = $(e.target).attr('name');
      let data = {
        room,
        user
      };
      status = STATUS.HALL;
      chatTo.type = STATUS.HALL;
      uroom = null;
      socket.emit('leave', data);
    })
    $('[data-type="room"]').dblclick((e) => {
      let _user = $(e.target).attr('name');
      chatTo.type = STATUS.ROOM;
    })
    $('[data-type="user"]').dblclick((e) => {
      let name = $(e.target).attr('name');
      let text = $('#message').text();
      if (chatTo.type === STATUS.USER) {
        text = text.replace(/\[.+\]:?/, '');
      }
      $('#message').text(`[say to ${name}]`);
      // $('#message').text(`[say to ${name}] ${text}`);
      chatTo.user = name;
      chatTo.type = STATUS.USER;
    })
  }

  // 用户登录聊天室
  let data = {
    user
  };
  socket.emit('online', data);

  socket.on('online', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.type));
    if (status === STATUS.HALL) {
      if (message.user === user) {
        temp.append($('<span>').text(`你已进入聊天室。`));
      } else {
        temp.append($('<span>').text(`欢迎新用户 - ${message.text} -`));
      }
      if (time - last > timeout) {
        temp.append('<br>');
        temp.append($('<span>').text(message.date));
        last = time;
      }
      msg.append(temp);
      $('#content').append(msg);
      scrollToBottom();
      flushRoomList(message);
    }
  });

  socket.on('flush', (message) => {
    if (status === STATUS.HALL) {
      flushRoomList(message);
    }
  });

  // 用户进入房间
  socket.on('join', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.type));
    if (message.user === user) {
      temp.append($('<span>').text(`你已进入房间 ${message.room}。`));
    } else {
      temp.append($('<span>').text(`用户 - ${message.text} - 已进入房间。`));
    }
    if (time - last > timeout) {
      temp.append('<br>');
      temp.append($('<span>').text(message.date));
      last = time;
    }
    msg.append(temp);
    $('#content').append(msg);
    scrollToBottom();
    flushUserList(message);
  });

  socket.on('leave', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.type));
    if (message.user === user) {
      temp.append($('<span>').text(`你已退出房间 - ${message.room}。`));
    } else {
      temp.append($('<span>').text(`用户 - ${message.text} - 已退出房间。`));
    }
    if (time - last > timeout) {
      temp.append('<br>');
      temp.append($('<span>').text(message.date));
      last = time;
    }
    msg.append(temp);
    $('#content').append(msg);
    scrollToBottom();
    if (message.user === user) {
      flushRoomList(message);
    } else {
      flushUserList(message);
    }
  });


  socket.on('offline', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.type));
    if (status === STATUS.HALL) {
      temp.append($('<span>').text(`用户 - ${message.text} - 离开了聊天室。`));
      if (time - last > timeout) {
        temp.append('<br>');
        temp.append($('<span>').text(message.date));
        last = time;
      }
      msg.append(temp);
      $('#content').append(msg);
      flushRoomList(message);
    } else if (uroom === message.room) {
      temp.append($('<span>').text(`用户 - ${message.text} - 离开了房间。`));
      if (time - last > timeout) {
        temp.append('<br>');
        temp.append($('<span>').text(message.date));
        last = time;
      }
      msg.append(temp);
      $('#content').append(msg);
      flushUserList(message);
    }
    scrollToBottom();
  });

  $('#message').keyup((e) => {
    if (e.which && e.which === 13) {
      let text = $('#message').text();
      if (!text) {
        return;
      }
      let data = {
        user,
        text,
        room: uroom,
        chatTo
      };
      socket.emit('chat', data);
      $('#message').text('');
    }
  });
  $('#send').click(() => {
    let text = $('#message').text();
    if (!text) {
      return;
    }
    let data = {
      user,
      text,
      room: uroom,
      chatTo
    };
    socket.emit('chat', data);
    $('#message').text('');
  });
  socket.on('chat', function (message) {
    if (message.chatTo.type !== STATUS.HALL || status === message.chatTo.type) {
      let msg = $('<div class="msg">'),
        temp = $('<p>'),
        time = new Date();
      if (message.user === user) {
        temp = $('<p class="right">');
        msg.append($('<p class="right">').text(message.user));
      } else {
        msg.append($('<p>').text(message.user));
      }
      temp.append($('<span>').text(message.text));
      if (time - last > timeout) {
        temp.append('<br>');
        temp.append($('<span>').text(message.date));
        last = time;
      }
      msg.append(temp);
      $('#content').append(msg);
      scrollToBottom();
    }
  });
})
