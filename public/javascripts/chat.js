$(() => {
  console.log('chat page document over.');
  let socket = io('http://localhost:3000');
  let name = 'owner';
  let last = new Date();
  $('#message').keyup((e) => {
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
    let msg = $('<div class="msg">'),
      temp = $('<p>'),
      time = new Date();
    msg.append($('<p>').text(data.name));
    temp.append($('<span>').text(data.text));
    if (time - last > 1000 * 10) {
      temp.append('<br>')
      temp.append($('<span>').text(data.date));
      last = time;
    }
    msg.append(temp);
    $('#content').append(msg);
    let offset = $('#content div:last-child').offset();
    console.log(offset);
    console.log($('#content').height());
    $('#content').scrollTop(offset.top);
  });
})
