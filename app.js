const express = require('express')
const app = express();
const port = 8000;
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const { promisify } = require('util')
const { pipeline } = require('stream')
const fileInfo = promisify(fs.stat);
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/YouTube";
mongoose.connect(url).then(() => {
  console.log('Sucessfully connected to the database')
}).catch(() => {
  console.log('database not connected')
})

const userDataSchema = require('./views/user');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const { createSecretKey } = require('crypto');

app.use(bodyParser.urlencoded({ extended: false }));
const userModel = mongoose.model('Users', userDataSchema);


app.use("/Views", express.static(__dirname + '/Views/'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views/Html/'));


app.get('/YouTube-user-Login', (req, res) => {
  res.render('Login')
})
app.post('/YouTube-user-Login', (req, res) => {
  res.render('Login')
});

app.get('/', (req, res) => {
  res.render('Home')
});

// get method on singup route
app.get('/YouTube-user-SignUp', (req, res) => {
  res.render('signUp')
})

// post method on singup route
app.post('/YouTube-user-SignUp', [
  check('user_Password', 'Invalid Password')
    .isLength({ min: 10 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.user_ConformPassword) {
        console.log('Password not Matched')
      } else {
        console.log('Password matched')
        
      }
    })
], (req, res) => {
  const error = validationResult(req);
  const userDetails = new userModel(req.body);
    userDetails.save().then((data) => {
      console.log(data)
    }).catch((e) => {
      console.log(e)
    });
    res.render('Home')
});


app.listen(port, () => {
  console.log(`Sucessfully run on http://localhost:${port}`);
});