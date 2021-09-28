const mongoose = require('mongoose');
const { url } = require('../config.json');

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error',() => {
  console.error.bind(console, 'connection error');
  process.kill(1)
});

db.once('open', async () => {
  console.log("> Successfully connected to the db ");
});

/**
* The schemas for the Models
**/

const accountSchema = new mongoose.Schema({
  user_id: {type: mongoose.ObjectId, required: true},
  platform_name: {type: String, required: true},
  username: { type: String },
  encrypted_password: {type: String, required: true},
  notes: String,
  upload_date: Date
})

const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  username: {type: String, requried: true},
  password_hash: {type: String, required: true},
})

const Account = mongoose.model('accounts', accountSchema);
const User = mongoose.model('users', userSchema);

module.exports = { User, Account };
