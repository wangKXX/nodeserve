const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const app = express();
const router = require('../router');

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookie());
function seviceStart() {
  // const router = express.Router();
  app.use('/', router);
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

module.exports = seviceStart;
