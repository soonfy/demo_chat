$(() => {
  console.log('chat page document over.');

  function scrollToBottom() {
    $('#content').scrollTop($('#content')[0].scrollHeight);
  };

  function flushRoomList(message) {
    let {rooms, users} = message;
    let roomsArr = Object.keys(rooms);
    $('#list').empty().append(`<div title="房间列表(${roomsArr.length}) - ${users.length}">房间列表(${roomsArr.length}) - ${users.length}</div>`);
    roomsArr.map((_room) => {
      $('#list').append(`<p data-type="room" name="${_room}" title="房间 ${_room}, 双击进入">${_room} - ${rooms[_room].length}</p>`)
    })
  }

  function flushUserList(message) {
    let {users, room} = message;
    $('#list').empty().append(`<div title="${room} - ${users.length}">${room} - ${users.length} </div>`);
    $('#list').append(`<div data-type="leave" name="${room}" title="双击离开房间">离开房间</div>`);
    users.map((_user) => {
      $('#list').append(`<p data-type="user" title="用户 ${_user}, 双击私信">${_user}</p>`)
    })
  }

  let user = Cookies.get('uname').trim();
  // let socket = io('http://localhost:3000');
  let socket = io();
  let timeout = 1000 * 60 * 10
  let last = new Date() - timeout;

  socket.emit('online', user);
  socket.on('online', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.user));
    temp.append($('<span>').text(`你已进入聊天室。`));
    if (time - last > timeout) {
      temp.append('<br>');
      temp.append($('<span>').text(message.date));
      last = time;
    }
    msg.append(temp);
    $('#content').append(msg);
    scrollToBottom();
    flushRoomList(message);

    $('[data-type="room"]').dblclick((e) => {
      let room = $(e.target).attr('name');
      let data = {
        room,
        user
      }
      socket.emit('join', data);
    })
  });

  socket.on('join', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.user));
    if (message.text === user) {
      temp.append($('<span>').text(`你已进入房间 - ${message.room}。`));
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
    flushUserList(message);

    $('[data-type="leave"]').dblclick((e) => {
      let room = $(e.target).attr('name');
      let data = {
        room,
        user
      }
      socket.emit('leave', data);
    })
  });

  socket.on('leave', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.user));
    temp.append($('<span>').text(`你已退出房间 - ${message.room}。`));
    if (time - last > timeout) {
      temp.append('<br>');
      temp.append($('<span>').text(message.date));
      last = time;
    }
    msg.append(temp);
    $('#content').append(msg);
    scrollToBottom();
    flushRoomList(message);

    $('[data-type="room"]').dblclick((e) => {
      let room = $(e.target).attr('name');
      let data = {
        room,
        user
      }
      socket.emit('join', data);
    })
  });


  socket.on('offline', (message) => {
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(message.user));
    temp.append($('<span>').text(`用户 - ${message.text} - 离开了聊天室。`));
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

  $('#message').keyup((e) => {
    if (e.which && e.which === 13) {
      let text = $('#message').text();
      if (!text) {
        return;
      }
      let data = {
        user,
        text
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
      text
    };
    socket.emit('chat', data);
    $('#message').text('');
  });
  socket.on('chat', function (message) {
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
  });
})
