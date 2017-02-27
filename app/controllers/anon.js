let http = require('http');

let getIp = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

let address = (ip, cb) => {
  let sina = `http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`;
  http.get(sina, (res) => {
    if (res.statusCode === 200) {
      res.on('data', (data) => {
        try {
          cb(null, JSON.parse(data));
        } catch (error) {
          console.log(error);
          cb(error);
        }
      })
    } else {
      cb({
        code: res.statusCode
      })
    }
  }).on('error', (error) => {
    console.log(error);
    cb(error);
  })
}

let ipadd_pro = (req) => {
  let promise = new Promise((resolve, reject) => {
    let ip = getIp(req);
    let sina = `http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=${ip}`;
    http.get(sina, (res) => {
      if (res.statusCode === 200) {
        res.on('data', (data) => {
          try {
            let address = JSON.parse(data);
            resolve({
              ip,
              address
            });
          } catch (error) {
            console.log(error);
            reject(error);
          }
        })
      } else {
        reject({
          code: res.statusCode
        })
      }
    }).on('error', (error) => {
      console.log(error);
      reject(error);
    })
  })
  return promise;
}

const getLogin = (req, res, next) => {
  ipadd_pro(req).then((data) => {
    console.log(data);
  })
  res.render('index', {
    title: 'chat',
    subtitle: '勇士，这个世界需要你。'
  });
}

module.exports = {
  getLogin
}