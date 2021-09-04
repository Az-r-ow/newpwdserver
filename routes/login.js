let express = require('express');
let router = express.Router();
const { User } = require('../helpers/dbConnection.js');
const { compare_hashes } = require('../helpers/helper_functions.js')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login', session: null, error: null});
});

/* POST login. */
router.post('/', async function(req, res, next){

  let username = req.body.username.trim()// Removing white spaces;
  let password = req.body.pwd;

  console.log(username)

  if( username === '' || password.trim() === ''){
    console.log("Invalid input")
    return res.render('login', {title: 'Login', session: false, error: 'Invalid user !'})
  }

   User.find({ username }, async (err, results) => {
    if(err){
      console.log("An error has occured while querying the user");
    }

    if(results.length === 0)return res.render('login', {title: 'Login', session: false, error: 'Invalid user please register first !'});

    // The user found in the db
    const user = results[0];

    console.log('User: ', user);
    console.log('User password hash :', user.password_hash);

    const pwd_match = await compare_hashes(password, user.password_hash);

    console.log('pwd_match => ', pwd_match);

    if(!pwd_match)return res.render('login', {title: 'Login', session: false, error: 'Wrong Password !'});


    console.log(results)

    console.log('userid => ', user._id);

    req.session.user_id = user._id.toString();
    console.log(`Your session userId is ${req.session.userId}`)
    req.session.username = user.username;
    req.session.auth = true;

    res.redirect('/home');

  })
});

module.exports = router;
