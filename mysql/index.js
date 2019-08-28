const mysql = require('mysql');
const config = require('./config');
const pool = mysql.createPool(config.mysql);

const user = {
  queryByID: 'select * from user where id=?',
  addUser: 'insert into user (id, nick, icon, des, pwd) values (?,?,?,?,?)',
  queryFriends: 'select * from user t where t.id in(select a.fid from user_relation a where a.id=?)',
  addFriend: 'insert into user_relation (id, fid) values (?, ?)'
}
function queryFactry(params, $sql) {
  return new Promise((resovle, reject) => {
    pool.getConnection((error, con) => {
      if (error) {
        reject(error)
      }
      console.log(params, $sql)
      con.query($sql, [ ...params ], (err, result) => {
        if (err) {
          reject(err)
        } else {
          resovle(result);
          // con.end();
          con.release();
        }
      });
    });
  });
}
module.exports = {
  selectByID: id => queryFactry([id], user.queryByID),
  addUser: params => queryFactry(params, user.addUser),
  getUserList: id => queryFactry([id], user.queryFriends),
  getUserById: id => queryFactry([id], user.queryByID),
  addFriend: params => queryFactry(params, user.addFriend)
}
