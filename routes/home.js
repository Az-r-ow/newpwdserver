const fs = require('fs');
let express = require('express');
let router = express.Router();
const { crypto_requirements } = require('../config.json');

//The Locals class that englobes all the local variables in used in the templates.
const Locals = require('../helpers/Locals.js');

//They key and the iv (initializing vector) both from the config.json file
const key = Buffer.from(crypto_requirements.key, 'hex');
const iv = Buffer.from(crypto_requirements.iv, 'hex');

const { User , Account} = require('../helpers/dbConnection.js');

const {
   hash,
   encrypt,
   decrypt,
   sort_data
 } = require('../helpers/helper_functions.js');

/**
 * home page where all the accounts are
 */

router.get('/', function(req, res, next) {

  let local_variables = new Locals('Home').setSession(req.session);

  if(req.query.sort_type){
    Account.find({user_id: req.session.user_id}).then(async data => {
      let sorted_data = await sort_data(req.query.sort_type, data);

      await sorted_data.forEach(async account => {
        account.encrypted_password = await decrypt(account.encrypted_password, key, iv);
      });

      local_variables.setData(sorted_data).setSort_type(req.query.sort_type);
      return res.render('home', local_variables);
    })
  }else{
    Account.find({user_id: req.session.user_id}).then(async data => {

      if(!data){
        local_variables.setMessage('Nothing to be displayed');
        return res.render('home', local_variables);
      };

      await data.forEach(async account => {
        account.encrypted_password = await decrypt(account.encrypted_password, key, iv);
      })

      local_variables.setData(data)

      return res.render('home', local_variables);
    }).catch(e => {
      console.log('An error occured while retreiving data : ', e);
      local_variables.setMessage('An error has occured while fetching your data.');
      return res.render('home', local_variables);
    })
  };
});

router.post('/', function(req, res, next){

  let local_variables = new Locals('Home', req.session);

  let acc_to_delete = req.body.deletedItem;

  Account.deleteOne({user_id: req.session.user_id, _id: acc_to_delete}).catch(e => {
    console.log('An error has occured when trying to delete the account information.')
    local_variables.setMessage('An error has occured.')
    return res.render('home', local_variables)
  })

  res.render('home',  local_variables);
})


/**
 * Logout route
 */

router.get('/logout', async function(req, res, next){

  let local_variables = new Locals('Logout');

  req.session.destroy(e => {
    if(e){
      console.log('An error has occured while destroying the session : ', e);
      res.render('login', {title: 'Login', session: null, error: 'A logout error has occured'})
    }
  });
  return res.render('login',local_variables);
})


/**
 * search route
 */

router.get('/search', async function(req, res, next){
  let local_variables = new Locals('Search', req.session);

  if(req.query.sort_type && req.query.user_input){

    //Setting the regex for the db search
    const regex = new RegExp(`${req.query.user_input}`);

    Account.find({user_id: req.session.user_id, platform_name: regex}).then(async data => {

      let sorted_data = await sort_data(req.query.sort_type.trim(), data);

      await sorted_data.forEach(async account => {
        account.encrypted_password = await decrypt(account.encrypted_password, key, iv);
      });

      req.session.last_search = req.query.user_input;

      await local_variables.setData(sorted_data).setSort_type(req.query.sort_type).setSession(req.session);

      return res.render('search', local_variables);
    })
  }else{
    return res.render('search', local_variables);
  };
})

router.post('/search', function(req, res, next){

  let local_variables = new Locals('Search', req.session);

  const search_query = req.body.user_input.trim();
  if(!search_query){
    local_variables.setError('What are you searching for ?')
    return res.render('search', local_variables)
  };

  const regex = new RegExp(`${req.body.user_input.trim()}`, 'i');

  if(req.query.sort_type && req.query.user_input){
    Account.find({user_id: req.session.user_id, platform_name: regex}).then(async data => {

      let sorted_data = await sort_data(req.body.sort_type.trim(), data);

      await sorted_data.forEach(async account => {
        account.encrypted_password = await decrypt(account.encrypted_password, key, iv);
      });

      req.session.last_search = req.body.user_input;

      await local_variables.setData(sorted_data).setSort_type(req.body.sort_type).setSession(req.sesion);
      return res.render('search', local_variables);
    })
  };


  Account.find({platform_name: regex, user_id: req.session.user_id}).then(data => {

    if(data.length === 0){
      local_variables.setMessage('Nothing was found :(.');
      return res.render('search', local_variables)
    }

    data.forEach(async account => {
      account.encrypted_password = decrypt(account.encrypted_password, key, iv);
    });

    req.session.last_search = req.body.user_input;

    local_variables.setData(data).setSession(req.session);

    return res.render('search', local_variables)
  }).catch(e => {
    console.log('An error has occured while fecthing the accounts');
    local_variables.setError('An error has occured while fetching the data, try again later.')
    res.render('search', local_variables);
  })

})

/**
 * add_account route
 */

router.get('/add_accounts', function(req, res, next){

  let local_variables = new Locals('Add Accounts', req.session);

  res.render('add_accounts', local_variables);

})

router.post('/add_accounts', async function(req, res, next){

  let local_variables = new Locals('Add Accounts', req.session);

  let platform_name = req.body.platform_name ? req.body.platform_name.trim() : req.body.platform_name;
  let username = req.body.username ? req.body.username.trim() : req.body.username;
  let email = req.body.email ? req.body.email.trim() : req.body.email;
  let password = req.body.password ? req.body.password.trim() : req.body.password;
  let notes = req.body.notes;

  if(!platform_name || !password){
    let missing_field = !password && !platform_name ? 'platform name and a password' :
    !password ? 'password' : !platform_name ? 'platform name' : '';

    local_variables.setError(`You forgot to input a ${missing_filed}`);

    return res.render('add_accounts', local_variables);
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
    return res.render('add_accounts', local_variables);
  }).catch(e => {
    console.log(`An error has occured trying to insert this account in the database : `, e);
    local_variables.setError('A db error has occured please try again.');
    return res.render('add_accounts', local_variables)
  })
})


/*
* Route for uploading a csv
*/

router.post('/upload_csv', async function(req, res, next){

  let csv_data = Object.values(req.body);

  //csv_data will be a 2d array of the data retreived from the
  // csv file uploaded

  //Fist of all check if the csv format is valid
  // There should be 3 important fields :
  // * platform name
  // * username
  // * password (non-encrypted)
  //
  // If any of these fileds is not present
  // An error should be returned

  let headers = csv_data[0].map(header => header.toLowerCase()); //The headers

  if(headers.filter(header => header.includes('platform_name') || header.includes('password') || header.includes('username')).length < 3){
    console.log('Invalid file format, one of the required columns was not found !');
    return res.json({"error": "Wrong data format !", "success_message": ""});
  }

  // Required column
  const index_platform_name = headers.map((header, index) => {return { header, index }}).filter(item => item.header.includes('platform_name'))[0].index;

  // Required column
  const index_username = headers.map((header, index) => {return {header, index}}).filter(item => item.header.includes('username') && item.header.trim().endsWith('username'))[0].index;

  // Required column
  const index_password = headers.map((header, index) => {return {header, index }}).filter(item => item.header.includes('password') && item.header.trim().endsWith('password'))[0].index;

  // If a notes column is not found,
  // Notes will all be empty strings in the db
  const index_notes = headers.map((header, index) => {return {header, index}}).filter(item => item.header.includes('notes') && item.header.trim().endsWith('notes')).length === 0 ?
  null : headers.map((header, index) => {return {header, index}}).filter(item => item.header.includes('notes') && item.header.trim().endsWith('notes'))[0].index ;

  // If an upload date column is not found
  // The current upload date will be inserted in the database instead
  const index_upload_date = headers.map((header, index) => {return {header, index}}).filter(item => item.header.includes('date')).length === 0 ?
  null : headers.map((header, index) => {return {header, index}}).filter(item => item.header.includes('date'))[0].index;


  let accounts_informations = csv_data.slice(1) //Removing the headers

  let user_id = req.session.user_id;

  try {

    accounts_informations.forEach((row, row_index) => {

      let platform_name = row[index_platform_name];
      //Making sure there's a platform name
      if(!platform_name.trim())throw `The platform name is missing on row ${row_index + 1} in the csv file`;

      // Usernames are not always required
      let username = row[index_username];

      // Making sure the password is not an empty string
      let password = row[index_password].trim();
      // Else throwing an error to the user indicating where the password is missing in the file;
      if(!password)throw `The password is missing on row ${row_index + 1} in the csv file`;
      let encrypted_password = encrypt(password, key, iv);

      let notes = "";
      if(index_notes){
        notes = row[index_notes];
      }

      let upload_date = Date.now();
      if(index_upload_date){
        upload_date = row[index_upload_date];
      }

      let newAccount = new Account({
        user_id,
        platform_name,
        username,
        encrypted_password,
        notes,
        upload_date
      })

      newAccount.save().then(() => {
        console.log('Account saved !');
      }).catch(e => console.log('An error has occured while saving the account in the db => ', e));

    })

  } catch (e) {
    console.log('An error has occured in the try catch block => ', e);

    res.json({"error":e, "message": ""})
  }

  return res.json({"error": "", "success_message": "Yay your data has been uploaded"});
})



module.exports = router;
