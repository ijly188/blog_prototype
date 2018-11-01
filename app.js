var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// puslugin
var flash = require('connect-flash')
var session = require('express-session')

require('dotenv').config()

// router
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('express-ejs-extend')); // add this line
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// test session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cokkie:{ maxAge: 100*1000 }
}))
app.use(flash())

// middleware
const authCheck = function (req, res, next){
  // console.log('middleware:', req.session)
  if ( req.session.uid === process.env.ADMIN_UID){
    return next();
  }
  return res.redirect('/auth/signin')
}

app.use('/', indexRouter);
app.use('/dashboard', authCheck, dashboardRouter);
app.use('/auth', authRouter);

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
