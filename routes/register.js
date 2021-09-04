var express = require('express');
var router = express.Router();
const { User } = require('../helpers/dbConnection.js')
const { hash } = require('../helpers/helper_functions.js');

/* GET register form. */
router.get('/', function(req, res, next) {
  //console.log("Register has been called !")
  return res.render('register', {title: 'Register', session: null, error: null })
});

/* POST register form */
router.post('/', async function(req, res, next) {


  const email = req.body.email.trim()
  const emailReg = /^\S+@\S+\.\S+$/i;
  if(!emailReg.test(email))return res.render('register', {title: 'Register', session: null, error: `Invalid email !`})
  const username = req.body.username.trim();
  const password = req.body.pwd.trim();
  const password_confirm = req.body.pwd_confirm.trim();

  if (username === "" || password === "" || password_confirm === "" || email === ""){
    const field = username === "" ?
     'username' : password === "" ?
     'password' : password_confirm === "" ?
     'password confirmation' : email === "" ?
     'email' : null;

     return res.render('register', {title: 'Register', session: null, error: `Your ${field} field cannot be empty !`})
  }

  if (password !== password_confirm)return res.render('register', {title: 'Register', session: null, error: 'Your passwords don\'t match'});

  const password_hash = await hash(password);

  const new_user = new User({
    email,
    username,
    password_hash
  });

  new_user.save().then(() => {
    console.log(`New user ${username} added to the db.`)
    return res.render('login', {title: 'Login', session: null, error: null  })
  })

});


module.exports = router;
