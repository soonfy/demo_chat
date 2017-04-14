const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const start = (url = `http://mongoosejs.com/docs/api.html`) => {
  console.log(`start crawl mongoose.`);
  console.log(`url ${url}`);
  let htmlpath = `./util/mongoose.html`,
    filepath = `./util/mongoose.apis.json`,
    options = {
      url: `http://mongoosejs.com/index.html`,
      method: 'GET',
      headers: {
        'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36`
      },
      timeout: 1000 * 20
    }
  request.get(options)
    .on('error', (error) => {
      console.error(error);
      return console.error(error.message);
    })
    .on('response', (resp) => {
      console.log(resp.statusCode);
      console.log(resp.headers);
      resp.headers['set-cookie'] ? options.headers.Cookie = resp.headers['set-cookie'] : '';

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
              console.log(`mongoose update html success.`);
            }
          })
          let $ = cheerio.load(body);
          let mongoose = {
            title: 'mongoose API Cheat Sheet',
            author: 'soonfy <soonfy@163.com>',
            description: 'elegant mongodb object modeling for node.js. Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.',
            apis: []
          }
          let eles = $('#content li.module');
          eles.map((i, e) => {
            let name = $(e).children('a').first().text().trim();
            let children = $(e).children('div.item');
            apis = children.map((ii, ee) => {
              return {
                name: $(ee).find('a').first().text().trim(),
                description: $(ee).children('p').first().text().trim(),
                uri: $(ee).find('a').first().attr('href') ? url + $(ee).find('a').first().attr('href').trim() : ''
              }
            })
            apis = Array.prototype.slice.call(apis);
            mongoose.apis.push({
              name: name,
              methods: apis
            })
          })
          fs.writeFile(filepath, JSON.stringify(mongoose, null, 2), (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`mongoose update apis success.`);
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