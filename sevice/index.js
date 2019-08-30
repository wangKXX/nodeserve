const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const app = express();
const router = require('../router');
const { fork } = require('child_process');
const path = require('path');
const redisTools = require('../redis/tools');
const timer = require('node-schedule');

const schedule = () => {
  const Timer = timer.scheduleJob('0 0 1 * * *', () => {
    logger.log('info', 'timer start');
    const childProcess = fork(path.resolve(__dirname, '../reptile/index.js'));
    childProcess.on('message', msg => {
      logger.log('info', msg);
      redisTools.setString('hotNews', msg);
    });
    childProcess.on('exit', (code, signal) => {
      logger.log('error', `process ${code} exit`);
    });
  })
};
schedule();

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookie());
app.use('/', router);
function seviceStart() {
  app.listen(3000, '', () => logger.log('info', 'server start!!!'));
}

module.exports = seviceStart;
