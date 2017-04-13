const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const start = (url = `http://expressjs.com/en/4x/api.html`) => {
  console.log(`start crawl Express`);
  console.log(`Express url ${url}`);
  let htmlpath = `./util/express.html`,
    filepath = `./util/express.apis.json`,
    options = {
      url: `http://expressjs.com/`,
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
      
      options.url = url;
      console.log(options);
      request(options, (error, resp, body) => {
        if (error) {
          console.error(error);
          return console.error(error.message);
        } else if (resp.statusCode === 200) {
          fs.writeFile(htmlpath, body, (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Express update html success.`);
            }
          })
          let $ = cheerio.load(body);
          let hs = $('div#api-doc>h2');
          let express = {
            title: 'Express API Cheat Sheet',
            author: 'soonfy <soonfy@163.com>',
            description: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
            apis: []
          }
          hs.map((i, e) => {
            let api = {
              name: $(e).text().trim(),
              description: $(e).next().text().trim()
            };
            let attrs = $(e).nextUntil('h2', 'h3');
            attrs.map((ii, ee) => {
              let attr = $(ee).text().trim();
              let els = $(ee).nextAll().toArray();
              let children = [];
              for (let child of els) {
                if ($(child).is('h2') || $(child).is('h3')) {
                  break;
                } else if ($(child).is('section')) {
                  children.push(child);
                } else {
                  // console.log($(child).text());
                }
              }
              children = children.map((eee) => {
                return {
                  api: $(eee).children().first().text().trim(),
                  description: $(eee).find('p').first().text().trim(),
                  uri: url + '#' + $(eee).children().first().attr('id').trim()
                }
              });
              api[attr] = Array.prototype.slice.call(children);
            })
            express.apis.push(api);
          })
          fs.writeFile(filepath, JSON.stringify(express, null, 2), (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Express update apis success.`);
            }
          })
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
