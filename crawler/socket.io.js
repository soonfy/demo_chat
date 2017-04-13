const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const start = (urls = [`https://socket.io/docs/server-api/`, `https://socket.io/docs/client-api/`]) => {
  console.log(`start crawl socket.io`);
  console.log(`socket.io url ${urls.join(' ')}`);
  let htmlpath = `./util/socket.io.html`,
    filepath = `./util/socket.io.apis.json`,
    options = {
      url: `https://socket.io/`,
      method: 'GET',
      headers: {
        'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36`
      },
      timeout: 1000 * 20
    }
  request.get(options)
    .on('error', (error) => {
      console.error(error);
      console.error(error.message);
    })
    .on('response', (resp) => {
      console.log(resp.statusCode);
      console.log(resp.headers);
      resp.headers['set-cookie'] ? options.headers.Cookie = resp.headers['set-cookie'] : '';

      fs.writeFile(filepath, '', (error) => {
        if (error) {
          console.error(error);
        }
      })
      let socketio = {
        title: 'socket.io API Cheat Sheet',
        author: 'soonfy <soonfy@163.com>',
        description: 'Socket.IO enables real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed.',
        apis: []
      }

      urls.map(url => {
        let name = 
        options.url = url;
        console.log(options);
        request(options, (error, resp, body) => {
          if (error) {
            console.error(error);
            return console.error(error.message);
          } else if (resp.statusCode !== 200) {
            console.error(resp.statusCode);
          } else {
            fs.writeFile(htmlpath, body, (error) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`socket.io update html success.`);
              }
            })
            let $ = cheerio.load(body);
            let eles = $('a.navigation-class');
            console.log(eles.length);
            eles.map((i, e) => {
              let name = $(e).text().trim(),
                apis = $(e).next().find('a');
              console.log(apis.length);
              apis = apis.map((ii, ee) => {
                console.log($(ee).text().trim());
                return {
                  api: $(ee).text().trim(),
                  uri: url + $(ee).attr('href').trim()
                }
              });
              apis = Array.prototype.slice.call(apis);
              let api = {
                name: name,
                methods: apis
              }
              socketio.apis.push(api);
            })
            fs.writeFile(filepath, JSON.stringify(socketio, null, 2), (error) => {
              if (error) {
                console.error(error);
              } else {
                console.log(`socket.io update apis success.`);
              }
            })
          }
        })
      })

    })
}

if (module.parent === null) {
  start();
} else {
  module.exports = start;
}
