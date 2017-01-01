var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./module/service/DBConnect');
var loginFilter = require('./module/filter/LoginFilter');

var routes = require('./routes/index');
var users = require('./routes/users');
var group = require('./routes/group');
var eat = require('./routes/eat');
var manage = require('./routes/eatmanage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'tengyue_session',
    resave: true,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000},
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

//登录拦截器
app.use(loginFilter);
app.use(function (req, res, next) {
    res.locals.user = req.session.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/group', group);
app.use('/eat', eat);
app.use('/eatmanage', manage);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
