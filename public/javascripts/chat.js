$(() => {
  console.log('chat page document over.');

  let socket = io.connect('localhost://3000');
  socket.on('open', () => {
    console.log('[client] connect server suc.');
  })

  socket.on('system', (msg) => {
    console.log('[client] receive system', msg);
  })

  socket.on('msg', (msg) => {
    console.log('[client] receive msg', msg);
  })

  $('button').click(() => {
    console.log('click button');
    socket.send('client send msg.');
  })
})