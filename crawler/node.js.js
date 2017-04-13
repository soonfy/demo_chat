const fs = require('fs');
const request = require('request');

const start = (url = `https://nodejs.org/dist/latest-v7.x/docs/api/all.json`) => {
  console.log(`start crawl Node.js`);
  console.log(`Node.js url ${url}`);
  let filepath = `./util/node.js.json`,
    options = {
      url: `https://nodejs.org/en/`,
      method: 'GET',
      headers: {
        'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36`
      }
    }
  request.get(options)
    .on('error', (error) => {
      console.error(error);
      console.error(error.message);
    })
    .on('response', (resp) => {
      console.log(resp.statusCode);
      options.url = url;
      options.headers.Cookie = resp.headers['set-cookie'];
      console.log(options);
      request(options, (error, resp, body) => {
        if (error) {
          console.error(error);
          return console.error(error.message);
        } else if (resp.statusCode === 200) {
          fs.writeFile(filepath, body, (error) => {
            if (error) {
              console.error(error);
              return console.error(error.message);
            } else {
              console.log(`Node.js update success.`);
            }
          })
          let data = JSON.parse(body);
          let nodejs = {
            title: 'Node.js API Cheat Sheet',
            author: 'soonfy <soonfy@163.com>',
            description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js\' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.',
            apis: []
          }
        } else {
          console.error(resp.statusCode);
        }
      })
    })
}

if (module.parent === null) {
  start();
} else {
  module.exports = start;
}