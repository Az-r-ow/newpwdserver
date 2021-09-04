const fs = require('fs');
let express = require('express');
let router = express.Router();
const { crypto_requirements } = require('../config.json');

const key = Buffer.from(crypto_requirements.key, 'hex');
const iv = Buffer.from(crypto_requirements.iv, 'hex');


const { User , Account} = require('../helpers/dbConnection.js')
const { hash, encrypt, decrypt } = require('../helpers/helper_functions.js');

router.post('/upload_csv', async function(req, res, next){
  
  let csv_data = Object.values(req.body);

  //csv_data will be a 2d array of the data retreived from the
  // csv file uploaded

  res.redirect('/');
})


/**
 * home page where all the accounts are
 */

router.get('/', function(req, res, next) {

  Account.find({user_id: req.session.user_id}).then(data => {
    if(!data)return res.render('home', {title: 'Home', session: req.session, data, message: 'Nothing to be displayed.'});

    data.forEach(account => {
      account.encrypted_password = decrypt(account.encrypted_password, key, iv);
    })

    return res.render('home', {title: 'Home', session: req.session, data, message: ''});
  }).catch(e => {
    console.log('An error occured while retreiving data : ', e);
    return res.render('home', {title: 'Home', session: req.session, data: null, message: 'An error has occured while fetching your data'});
  })

});

router.post('/', function(req, res, next){
  let acc_to_delete = req.body.deletedItem;

  Account.deleteOne({user_id: req.session.user_id, _id: acc_to_delete}, (e) => {
    console.log("An error has occured when deleting the account : ", e);
    return res.render('home', {error: 'An error has occured while deleting the account informations'})
  })

  res.render('home',  {title: 'Home', session: req.session, data: null, message: null})
})


/**
 * Logout route
 */

router.get('/logout', function(req, res, next){
  req.session.destroy(e => {
    if(e){
      console.log('An error has occured while destroying the session : ', e);
      res.render('login', {title: 'Login', session: null, error: 'A logout error has occured'})
    }
  });
  return res.render('login', {title: 'Login', session: null, error: null})
})


/**
 * search route
 */

router.get('/search', async function(req, res, next){

  res.render('search', {title: 'Search', session: req.session, error: null, data: null, message: ''});
})

router.post('/search', function(req, res, next){

  const search_query = req.body.user_input.trim();
  if(!search_query)return res.render('search', {title: 'Search', session: req.session, error: 'What are you searching for ?', data: null, message: ''})

  const regex = new RegExp(`${req.body.user_input.trim()}`, 'i');

  Account.find({platform_name: regex, user_id: req.session.user_id}).then(data => {

    if(data.length === 0){
      return res.render('search', {title: 'Search', session: req.session, error: false, data: null, message: 'Nothing was found :(' })
    }

    data.forEach(async account => {
      account.encrypted_password = decrypt(account.encrypted_password, key, iv);
    })

    return res.render('search', {title: 'Search', session: req.session, error: false, data, message: ''})
  }).catch(e => {
    console.log('An error has occured while fecthing the accounts');
    res.render('search', {title: 'Search', session: req.session, error: 'An error has occured while fetching data try again.'})
  })

})


/**
 * add_account route
 */

router.get('/add_accounts', function(req, res, next){
  res.render('add_accounts', {title: 'Add Accounts', session: req.session, error: null})
})

router.post('/add_accounts', async function(req, res, next){

  let platform_name = req.body.platform_name ? req.body.platform_name.trim() : req.body.platform_name;
  let username = req.body.username? req.body.username.trim() : req.body.username;
  let email = req.body.email ? req.body.email.trim() : req.body.email;
  let password = req.body.password ? req.body.password.trim() : req.body.password;
  let notes = req.body.notes;

  if(!platform_name || !password){
    let missing_field = !password && !platform_name ? 'platform name and a password' :
    !password ? 'password' : !platform_name ? 'platform name' : '';
    return res.render('add_accounts', {title: 'Add Accounts', session: req.session, error: `You forgot to input a ${missing_field}`})
  }

  password = await encrypt(password, key, iv)

  let newAccount = new Account({
    user_id: req.session.user_id ,
    platform_name,
    username,
    encrypted_password: password,
    notes,
    upload_date: Date.now()
  })

  newAccount.save().then(() => {
    console.log(`Account added to the db !`)
    return res.render('add_accounts', {title: "Add Accounts", session: req.session, error: null});
  }).catch(e => {
    console.log(`An error has occured trying to insert this account in the database : `, e);
    return res.render('add_accounts', {title: "Add Accounts", session: req.session, error: "A db error has occured please try again."})
  })
})


module.exports = router;
