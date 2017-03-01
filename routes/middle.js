const visitModel = require('../app/models/visit.js');
let http = require('http');

let getIp = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

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

const authenticate = (req, res, next) => {
  let noLoginUrls = ['/index'];
  if (noLoginUrls.includes(req.url)) {
    return next();
  }
  let loginUrls = ['/', '/signup', '/signin', '/user/signup', '/user/signin'];
  if (!loginUrls.includes(req.url) && !req.session.user) {
    console.log('未登录，跳转到登录页。');
    return res.redirect('/');
  } else if(loginUrls.includes(req.url) && req.session.user){
    console.log('已登录，自动跳转到首页。');
    return res.redirect('/index');
  }
  // if (loginUrls.includes(req.url) && req.method === 'post' && req.session.user) {
  //   console.log('已登录，禁止重复登录。');
  //   return res.redirect('back');
  // }
  next();
}

const countVisit = (req, res, next) => {
  ipadd_pro(req).then((data) => {
    return data;
  }).then((data) => {
    let _visit = new visitModel({
      url: req.url,
      ip: data.ip,
      address: data.address
    })
    _visit.save();
  }).then(() => {
    next();
  }).catch((error) => {
    console.log(error);
    next(error);
  })
}

module.exports = {
  authenticate,
  countVisit
}
