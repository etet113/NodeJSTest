var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser =  bodyParser.json();
const isEmail = (text) => {
  console.log(text);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {

    errorMsg = 'Email is Not Correct';
    console.log(errorMsg);
    return false;
  }
  else {
    console.log("Email is Correct");
    errorMsg = '';
    return true;
  }
}
const validate = (mail,pwd) => {

  let email = 'nono123011@yahoo.com.hk'
  let password = '123456';

  if (email === mail &&  password === pwd) {
    return true;
  }
  else {
    return false;
  }
}

let person = {
  clinic:'San Po Kong',
  doctor_name:'peter',
  patient_name:'Kit',
  diagnosis:'N/A',
  medication:'N/A',
  consultation_fee:'100',
  date: new Date(),
};

router.post('/login',urlencodedParser, function(req, res) {
  console.log('email:' + req.body.email);
  console.log('password:' + req.body.password);
  console.log('hostname:' + req.hostname );

  // 输出 JSON 格式
  var ePass = isEmail(req.body.email);
  var isUser = validate(req.body.email,req.body.password)
  var isPass = ePass && isUser

  var booking = [];
  for(let i = 0; i < 8; i++){
    var obj = Object.assign({}, person)
    var newDate = new Date();
    newDate.setDate(newDate.getDate()+i+1);
    obj.date= newDate;
    booking.push(obj)
  }

  var response = {
    "isPass":isPass,
    "booking":booking,
  };
  res.send(JSON.stringify(response));
});

router.get('/test', function(req, res) {
  var response = {
    "email":"req.body.email",
    "password":"req.body.password"
  };
  console.log(response);
  res.send(JSON.stringify(response));
});

router.get('*', function(req, res) {
  res.send('404 not found');
});





module.exports = router;
