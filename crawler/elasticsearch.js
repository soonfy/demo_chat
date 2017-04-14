const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const start = (url = `https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html`) => {
  console.log(`start crawl elasticsearch.`);
  console.log(`url ${url}`);
  let htmlpath = `./util/elasticsearch.html`,
    filepath = `./util/elasticsearch.apis.json`,
    options = {
      url: `https://www.elastic.co/`,
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
              console.log(`elasticsearch update html success.`);
            }
          })
          let $ = cheerio.load(body);
          let elasticsearch = {
            title: 'elasticsearch API Cheat Sheet',
            author: 'soonfy <soonfy@163.com>',
            description: 'Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases. As the heart of the Elastic Stack, it centrally stores your data so you can discover the expected and uncover the unexpected.',
            apis: []
          }
          let name = $('#guide').find('h1').text().trim().slice(0, -4);
          let children = $('#guide div.section');
          apis = children.map((ii, ee) => {
            return {
              name: $(ee).children('.titlepage').next().find('pre').text().trim(),
              description: $(ee).children('p').first().text().trim(),
              uri: $(ee).find('h2').find('a').first().attr('id') ? url + '#' + $(ee).find('h2').find('a').first().attr('id').trim() : ''
            }
          })
          apis = Array.prototype.slice.call(apis);
          elasticsearch.apis.push({
            name: name,
            methods: apis
          })
          fs.writeFile(filepath, JSON.stringify(elasticsearch, null, 2), (error) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`elasticsearch update apis success.`);
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