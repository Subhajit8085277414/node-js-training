const express = require('express');
const user = require('./user');
const mongo = require('./mongoConn');

const app = express();
app.use('/user', user);
mongo.connect(function (err) {
  if (err) {
    console.log(err);
  }

  app.listen(3003, function () {
    console.log("server running on port 3003");
  })
})
