$(() => {
  console.log('chat page document over.');
  let user = '<%= user %>';
  console.log(user);

  let list = $('#list');
  let hist = $('#hist');
  let cont = $('#cont');

  //建立websocket连接
  socket = io.connect('http://localhost:3000');
  //收到server的连接确认
  socket.on('open', function () {
    console.log('[client] connect suc.');
  });

  //监听system事件，判断welcome或者disconnect，打印系统消息信息
  socket.on('system', function (json) {
    console.log(json);
    let p = '';
    if (json.type === 'welcome') {
      // if (myName == json.text) status.text(myName + ': ').css('color', json.color);
      p = '<p style="background:' + json.color + '">system  @ ' + json.time + ' : Welcome ' + json.text + '</p>';
    } else if (json.type == 'disconnect') {
      p = '<p style="background:' + json.color + '">system  @ ' + json.time + ' : Bye ' + json.text + '</p>';
    }
    hist.prepend(p);
  });

  //监听message事件，打印消息信息
  socket.on('message', function (json) {
    console.log(json);
    var p = '<p><span style="color:' + json.color + ';">' + json.author + '</span> @ ' + json.time + ' : ' + json.text + '</p>';
    hist.prepend(p);
  });

  //通过“回车”提交聊天信息
  cont.keydown((e) => {
    if (e.keyCode === 13) {
      var msg = cont.val();
      if (!msg) {
        return;
      } else {
        socket.send(msg);
        cont.val('');
      }
    }
  })

})
