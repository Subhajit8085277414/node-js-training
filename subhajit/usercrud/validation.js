const exp = require('express');
const mydbConn = require('./mongoConn');
let userResult;

let isEmpty = function (obj) {
  return Object.keys(obj).length === 0;
}


let checkIfEmailExist = function (mail, callback) {
  var findobj = { email: mail };
  mydbConn.get().collection('userdetail').find(findobj).toArray(function (err, result) {
    userResult = result;
    console.log(userResult);

    if (isEmpty(userResult)) {
      return callback(true);
    }
    else {

      return callback(false);
    }

  })

}

let checkemail = function (email) {
  if ((/[a-z]+[0-9]*[@]gmail.com/).test(email))
    return true;
  else
    return false;

}

let  checkMobNo = function (monNo) {
  if ((/^[6-9][0-9]{9}$/).test(monNo))
    return true;
  else
    return false;

}



module.exports = {
  isEmpty,
  checkIfEmailExist,
  checkemail,
  checkMobNo
};

