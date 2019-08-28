const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const util = require('../common');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    let { mimetype } = file;
    mimetype = mimetype.substring(mimetype.indexOf('/') + 1, mimetype.length);
    cb(null, file.fieldname + '-' + Date.now() + '.' + mimetype);
  }
})
const upload = multer({ storage })
router.use('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

router.post('/userLogin', async (res, resp) => {
  const { body: { params } } = res
  console.log(params);
  const { id } = params;
  const pass = params.pwd;
  // 登入成功后生成sessionID,将用户的信息存储到redis
  const result = await mysql.selectByID(id);
  if (result.length !== 0) {
    const pwd = result[0].pwd;
    if (pwd === pass + '') {
      resp.send(util.commonResp(0, 'success', result));
    } else {
      resp.send(util.commonResp(403, 'fail', '用户名或密码错误'));
    }
  } else {
    resp.send(util.commonResp(403, 'fail', '用户名或密码错误'));
  }
});

router.post('/register', upload.single('icon'), async (res, resp) => {
  const { body: { id, pwd, nick, des }, file: { path } } = res;
  const params = [
    +id,
    nick,
    path,
    des,
    pwd
  ]
  try {
    const result = await mysql.addUser(params);
    resp.send(util.commonResp(0, 'success'));
  } catch (error) {
    console.log(error);
    if (error.errno === 1062) {
      resp.send({data: { ...(util.commonResp(1062, 'error', { mesgContent: '您的账号已经被注册了！' }))}})
    }
  }
});

router.post('/getUserList', async (res, resp) => {
  const { id } = res.body;
  const result = await mysql.getUserList(id);
  resp.send(util.commonResp(0, 'success', result));
});

router.post('/getUserById', async (res, resp) => {
  const { id } = res.body;
  const result = await mysql.getUserById(id);
  resp.send(util.commonResp(0, 'success', result));
})
module.exports = router;