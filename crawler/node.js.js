const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const start = (url = `https://nodejs.org/dist/latest-v7.x/docs/api/all.html`) => {
  console.log(`start crawl Node.js`);
  console.log(`Node.js url ${url}`);
  let jsonpath = `./util/node.js.json`,
    filepath = `./util/node.js.apis.json`,
    options = {
      url: `https://nodejs.org/en/`,
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
      options.headers.Cookie = resp.headers['set-cookie'];

      options.url = `https://nodejs.org/dist/latest-v7.x/docs/api/all.json`;
      console.log(options);
      request(options, (error, resp, body) => {
        if (error) {
          console.error(error);
          return console.error(error.message);
        } else if (resp.statusCode === 200) {
          fs.writeFile(jsonpath, body, (error) => {
            if (error) {
              console.error(error);
              return console.error(error.message);
            } else {
              console.log(`Node.js update json success.`);
            }
          })
        } else {
          console.error(resp.statusCode);
        }
      })

      options.url = url;
      console.log(options);
      request(options, (error, resp, body) => {
        if (error) {
          console.error(error);
          return error.message;
        } else if (resp.statusCode !== 200) {
          console.error(statusCode);
        } else {
          let $ = cheerio.load(body);
          let eles = $('#toc>ul>li');
          let nodejs = {
            title: 'Node.js API Cheat Sheet',
            author: 'soonfy <soonfy@163.com>',
            description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js\' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.',
            apis: []
          };
          eles.map((i, e) => {
            let name = $(e).children().first().text().trim(),
              apis = $(e).children().last().find('a');
            apis = apis.map((ii, ee) => {
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
            nodejs.apis.push(api);
          })
          fs.writeFile(filepath, JSON.stringify(nodejs, null, 2), (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Node.js update apis success.`);
            }
          })
        }
      })

    })
}

if (module.parent === null) {
  start();
} else {
  module.exports = start;
}
