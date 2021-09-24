const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const logger = require('morgan');
const session = require('express-session');

const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const homeRouter = require('./routes/home');

const { url } = require('./config.json');

// Requirements to connect to the db
require("./helpers/dbConnection.js");

// Check for a security key in the config.json file
// Initialize one if not already initialzed
require("./helpers/security_key_checker.js");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: url,
    ttl: 60 * 60,
  })
}))

const checkAuthentication = (req, res, next) => {
  if(!req.session.auth){
    res.redirect('/');
  }else{
    next();
  }
}


app.use('/', loginRouter);
app.use('/register', registerRouter);
app.use('/home', checkAuthentication, homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
