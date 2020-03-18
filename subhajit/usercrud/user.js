const express = require('express');
const router = express.Router();
const myDbConn = require('./mongoConn');
const bodyparser = require('body-parser');
const validator = require('./validation');

router.use(bodyparser.json());
let userResult;
router.get('/', function (req, res) {//get all the user

  myDbConn.get().collection('userdetail').find({}).toArray(function (err, result) {
    userResult = result;
    if (err) {
      console.log(err)
    }
    else {
      res.json(userResult);
    }
  })
})

router.get('/:email', function (req, res) {//get user with perticular email
  let findobj = { email: req.params.email };

  myDbConn.get().collection('userdetail').find(findobj).toArray(function (err, result) {
    userResult = result;
    if (err) {

      console.log(err)
    }

    else {

      res.json(userResult);
    }
  });
})


router.post('/add', function (req, res) {//insertion
  let emailbody = req.body.email;
  let emailvalid = validator.checkemail(req.body.email);
  let phoneNoValid = validator.checkMobNo(req.body.mobile);
  if (emailvalid && phoneNoValid) {
    validator.checkIfEmailExist(emailbody, function (output) {
      if (!output) {
        res.status(409).json("Email Id already exists");
      }

      else {
        myDbConn.get().collection('userdetail').insertOne(req.body, function (err, res) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("1 document inserted");
          }
        });
        res.json({ "insertion ": "true" });
      }
    })

  }
  else {
    res.status(400).json("enter valid email & password  ");

  }
})

router.delete('/delete', function (req, res) {//delete with the use of request body
  myDbConn.get().collection('userdetail').deleteOne(req.body, function (err, res) {
    if (err) {
      console.log(err);

    }
    else {
      res.json("1 item deleted");
    }
  })

})

router.delete('/delete/:email', function (req, res) {//delete with the use of request param
  let delobj = { email: req.params.email };
  myDbConn.get().collection('userdetail').deleteOne(delobj, function (err, obj) {

    noOfDelItem = obj.result.n;
    if (err) {
      console.log(err);
    }
    if ((noOfDelItem) < 1) {
      res.status(400).json("no item with given email");
    }
    if ((noOfDelItem) == 1) {
      res.json("Deleted 1 item successfully");
    }
  })
})

router.put('/update/:email', function (req, res) {//updation
  let newData = { $set: { id: req.body.id, name: req.body.name, email: req.body.email } };
  let previous = { email: req.params.email }
  myDbConn.get().collection('userdetail').updateOne(previous, newData, function (err, obj) {

    if ((obj.result.nModified) == 0)
      res.status(400).json(`Failed to update the document !! `);
    else
      res.json(`updated ${obj.result.nModified} document successfully !!!`);
  })

})

module.exports = router;