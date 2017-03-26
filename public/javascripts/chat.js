$(() => {
  console.log('chat page document over.');
  let socket = io('http://localhost:3000');
  let name = 'owner';
  let last = new Date();
  $('#message').keypress((e) => {
    if (e.which && e.which === 13) {
      socket.emit('chat message', $('#message').text());
      $('#message').text('');
    }
  });
  $('#send').click(() => {
    socket.emit('chat message', $('#message').text());
    $('#message').text('');
  });
  socket.on('chat message', function (data) {
    let msg, date = new Date();
    if (name === data.name) {
      msg = $('<p>').append($('<span class="owner name">').text(data.name)).append($('<span class="msg owner">').text(data.text));
      if (date - last > 1000 * 10) {
        msg.append($('<span class="time owner">').text(date));
        last = date;
      }
    } else {
      msg = $('<p>').append($('<span class="other name">').text(data.name)).append($('<span class="msg other">').text(data.text));
      if (date - last > 1000 * 10) {
        msg.append($('<span class="time other">').text(date));
        last = date;
      }
    }
    $('#content').append(msg);
  });
})
