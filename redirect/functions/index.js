const functions = require('firebase-functions');

// exports.date = functions.https.onRequest((req, res) => {
//   // ...
// });

const express = require('express');
const cors = require('cors');
const soap = require('soap');
const app = express();
const bodyParser = require('body-parser')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const router = express.Router()
var firebase = require('firebase')


// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', bodyParser.json(), router)   //[use json]
app.use('/api', bodyParser.urlencoded({ extended: false }), router)
var options = {
  'endpoint' : 'https://passport.psu.ac.th/authentication/authentication.asmx'
};


const firebaseConfig = {
  apiKey: "AIzaSyDS3UaX3BHpuR9nkgGPEXNwsRz4ZajS6c0",
  authDomain: "psupktmaterial.firebaseapp.com",
  databaseURL: "https://psupktmaterial.firebaseio.com",
  projectId: "psupktmaterial",
  storageBucket: "psupktmaterial.appspot.com",
  messagingSenderId: "673539716089",
  appId: "1:673539716089:web:67e7cce961c3cab2"
}


firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
router.route('/')
  .get((req, res) => {
    res.send('hello test12')
  })
  .post((req, res) => {
    // res.send(req.body.username)
    soap.createClientAsync(url, (err, client) => {
       console.log('soap entered');
       if (err){
        console.error(err);
         res.send("error ----: ")
       }
        
       else {
        let user = {}
        user.username = req.body.username
        user.password = req.body.password
        res.send(user)
        client.GetStaffDetails(user, (err, response) => {
          if (response.GetStaffDetailsResult.string[0] == "") {
            res.send('error')
            console.error(err);
          }
          else {
            console.log("Show_profile ", response)
            database.ref('users').child(user.username).once("value", snapshot => {
              if (snapshot.exists()) { // check ว่ามีการสร้างแล้วหรือยัง
                console.log('already exists')
                // res.send('<script>alert("มีข้อมูลในระบบแล้ว");</script>');
                res.send(response.GetStaffDetailsResult.string)
                return false;
              } else {
                console.log('bad bad')
                // หากยังไม่มีจะทำการสร้างกระเป๋า 
                database.ref('users').child(user.username).push({
                  name: response,
                }).then(() => {
                  res.send(response.GetStaffDetailsResult.string)
                  return false;
                  // res.redirect("/showdata)                 
                }).catch(e => {
                  console.log(e)
                })
              }
            })
          }
        })
       }
    })
  })

// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);