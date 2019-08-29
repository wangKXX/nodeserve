const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const app = express();
const router = require('../router');
// require('../reptile');

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookie());
app.use('/', router);
function seviceStart() {
  app.listen(3000, '', () => logger.log('info', 'server start!!!'));
}

module.exports = seviceStart;
