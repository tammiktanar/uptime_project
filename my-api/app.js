require('dotenv').config({ path: '../my-app/.env' })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var resgisterRouter = require('./routes/register');
var reservationsRouter = require('./routes/reservations/reservations');
var reservationsCreateRouter = require('./routes/reservations/createReservation');
var pricelistRouter = require('./routes/data/pricelist');

const { initDb } = require('./mysql/db');
const { getAllUsers } = require('./mysql/get/users');

var app = express();
initDb()


app.options('*', function(req,res,next) {
    
    res.header("Access-Control-Allow-Origin", process.env.PUBLIC_SITE_HTTP+'://'+process.env.PUBLIC_SITE_IP+':'+process.env.PUBLIC_SITE_PORT);
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", [
        'X-Requested-With', 
        'content-type',
        'credentials'
    ]);
    res.header("Access-Control-Allow-Methods", 'GET,POST');
    res.status(200);

    next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/register', resgisterRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/reservationsCreate', reservationsCreateRouter);
app.use('/api/pricelist', pricelistRouter);

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