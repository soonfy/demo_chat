const visitModel = require('../app/models/visit.js');
const BlogModel = require('../app/models/blog.js');

const http = require('http');
const str = 'qwertyuiopasdfghjklzxcvbnm1234567890';
const len = str.length;

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

const authenticate = (uris = []) => {
  return (req, res, next) => {
    if (req.session.uid) {
      console.log(`${req.session.uname} 访问网页。`);
      return next();
    }
    if (req.path === '/index.html') {
      return next();
    }
    if (uris.includes(req.path)) {
      let salt = '',
        ind = 0;
      while (ind < 4) {
        ++ind;
        salt += str.charAt(Math.floor(Math.random() * len));
      }
      req.session.uname = salt;
      console.log(`未登录，随机名字${req.session.uname}。`);
      next();
    } else {
      console.log(`限制登录，跳转到登录页。`);
      return res.redirect('/index.html');
    }
  }
}

const countVisit = (uris = []) => {
  return (req, res, next) => {
    ipadd_pro(req).then((data) => {
      return data;
    }).then((data) => {
      if (!uris.includes(req.path)) {
        let _visit = new visitModel({
          uid: req.session.uid || req.session.uname,
          url: req.path,
          ip: data.ip,
          address: data.address
        })
        _visit.save();
      }
    }).then(() => {
      next();
    }).catch((error) => {
      console.log(error);
      res.redirect('/index.html');
    })
  }
}

const countBlog = (keys = []) => {
  return (req, res, next) => {
    BlogModel.distinct('key', (error, keys) => {
      if (error) {
        next(error);
      } else {
        req.keys = res.locals.keys = keys;
        next();
      }
    })
  }
}

const countKeys = (keys) => {
  return (req, res, next) => {
    keys = keys || req.keys || [];
    let completedTasks = 0,
      len = keys.length,
      keyCount = {};
    const checkIfComplete = (tasks) => {
      completedTasks++;
      if (completedTasks === len) {
        console.log(keyCount);
        req.keyCount = res.locals.keyCount = keyCount;
        next();
      }
    }
    for (var index in keys) {
      ((key) => {
        BlogModel.count({
          key: key
        }, (error, num) => {
          if (error) {
            console.error(error);
          } else {
            keyCount[key] = num;
            checkIfComplete(keys);
          }
        })
      })(keys[index])
    }
  }
}

const createBread = () => {
  return (req, res, next) => {
    let uri = req.path,
      bread = [{
        name: '首页',
        href: '/home.html'
      }];
    switch (uri) {
      case '/home.html':
        bread = [];
        break;

      default:
        break;
    }
    res.locals.bread = bread;
    next();
  }
}

module.exports = {
  authenticate,
  countVisit,
  countBlog,
  countKeys,
  createBread
}
