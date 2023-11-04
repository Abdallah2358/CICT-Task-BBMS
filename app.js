const createError = require('http-errors');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
// const { Sequelize } = require('sequelize');
const db = require("./database/models");
// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const donorsRouter = require('./routes/donors');
const donationRouter = require('./routes/donations');
const donationRequestRouter = require('./routes/donation-requests');
const bloodRequestRouter = require('./routes/blood-requests');
const hospitalOfficialRouter = require('./routes/hospital-officials');

// DB Connection
// const sequelize = new Sequelize('bbms', 'root', '', {
//   host: 'localhost',
//   dialect:  'mysql'
// });
// try {
//   sequelize.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// use layout
app.use(expressLayouts);

app.set('layout', './layouts/dashboard')

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: false,
  cookie: { maxAge: oneDay, secure: false, httpOnly: false },
  resave: false
}));

// make session available in all views
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/donors', donorsRouter);
app.use('/donations', donationRouter);
app.use('/donation-requests', donationRequestRouter);
app.use('/blood-requests', bloodRequestRouter);
app.use('/hospital-officials', hospitalOfficialRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { layout: false, url: req.url });
});

module.exports = app;
