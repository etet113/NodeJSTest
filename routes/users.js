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
    return true;
  }
};
const isOnlyNum = (num) =>{
  const re = /^[0-9\b]+$/;
  if (re.test(num)) {
    return true;
  }else {
    return false;
  }
};

let person = {
  clinic:'San Po Kong',
  doctor_name:'peter',
  patient_name:'Kit',
  diagnosis:'N/A',
  medication:'N/A',
  consultation_fee:'100',
  date: new Date(),
};

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Kit:Kit_123456@cluster0.38tbx.gcp.mongodb.net/Project_Test?retryWrites=true&w=majority";


router.post('/login',urlencodedParser, function(req, res) {
  console.log('email:' + req.body.email);
  console.log('password:' + req.body.password);
  console.log('hostname:' + req.hostname );
  const client = new MongoClient(uri, { useNewUrlParser: true });
  // 输出 JSON 格式
  var ePass = isEmail(req.body.email);
  if(ePass === true){
    client.connect(() => {
      client.db("sample_user").collection("user")
          .find({email:req.body.email,password:req.body.password})
          .toArray(function(err, result) {
            if(result.length > 0){
              console.log(result);
              var booking = [];
              for(let i = 0; i < 8; i++){
                var obj = Object.assign({}, person)
                var newDate = new Date();
                newDate.setDate(newDate.getDate()+i+1);
                obj.date= newDate;
                booking.push(obj)
              }
              var response = {
                "isPass":true,
                "booking":booking,
              };
              res.send(JSON.stringify(response));
              // res.send({isPass:true});
              client.close();
            }else {
              console.log("No This Account");
            }
          });
    });
  }

  // var booking = [];
  // for(let i = 0; i < 8; i++){
  //   var obj = Object.assign({}, person)
  //   var newDate = new Date();
  //   newDate.setDate(newDate.getDate()+i+1);
  //   obj.date= newDate;
  //   booking.push(obj)
  // }
  // var response = {
  //   "isPass":isPass,
  //   "booking":booking,
  // };
  // res.send(JSON.stringify(response));
});

router.post('/register',urlencodedParser, function(req, res) {

  console.log('hostname:' + req.hostname );
  console.log('email:' + req.body.email);
  console.log('password:' + req.body.password);
  console.log('clinic_name:' + req.body.clinic_name);
  console.log('phone_number:' + req.body.phone_number);
  console.log('address:' + req.body.address);
  const client = new MongoClient(uri, { useNewUrlParser: true });

  var userInfo = {
    email: req.body.email,
    password: req.body.password,
    clinic_name:  req.body.clinic_name,
    phone_number: req.body.phone_number,
    address: req.body.address
  }

  console.log(isEmail(req.body.email));
  console.log(isOnlyNum(req.body.phone_number));
  if(isEmail(req.body.email) && isOnlyNum(req.body.phone_number)){
    client.connect(err => {
      client.db("sample_user")
          .collection("user")
          .insertOne(userInfo, function(err, re) {
            console.log("1 document inserted");
            res.send(JSON.stringify({
                "isPass":true,
                "msg":"OK,Finish Register",
              }));
          });
      client.db("sample_user")
          .collection("booking")
          .insertOne(userInfo, function(err, re) {
            console.log("1 document inserted");
            res.send(JSON.stringify({
              "isPass":true,
              "msg":"OK,Finish Register",
            }));
          });
    });
  }else {
    if(isEmail(req.body.email)){
      res.send(JSON.stringify({
        "isPass":false,
        "msg":"Email Error",
      }));
    }else {
      res.send(JSON.stringify({
        "isPass":false,
        "msg":"PhoneNumer Error",
      }));
    }
  }

});


// router.post('/booking',urlencodedParser, function(req, res) {
//
//   console.log('hostname:' + req.hostname );
//   console.log('email:' + req.body.email);
//   // var booking = [];
//   // for(let i = 0; i < 8; i++){
//   //   var obj = Object.assign({}, person)
//   //   var newDate = new Date();
//   //   obj.date= newDate;
//   //   booking.push(obj)
//   // }
//   var response = {
//     "isPass":isPass,
//     // "booking":booking,
//   };
//   console.log(response);
//   res.send(JSON.stringify(response));
//
// });

router.get('/test', function(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("sample_airbnb").collection("listingsAndReviews");
    collection.find({name: "Ribeira Charming Duplex"}).toArray(function(err, result) {
      console.log(result);
      res.send(result);
      client.close();
    });
  });

  // console.log(response);
  // res.send(response);
});

// router.get('/test2', function(req, res) {
//   const client = new MongoClient(uri, { useNewUrlParser: true });
//   client.connect(err => {
//     const collection = client.db("sample_user").collection("user");
//     var myobj = { name: "Company Inc", address: "Highway 37" };
//     collection.insertOne(myobj, function(err, res) {
//       console.log("1 document inserted");
//     });
//   });
// });

router.get('*', function(req, res) {
  res.send('404 not found');
});

module.exports = router;
