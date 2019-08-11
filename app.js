var express = require('express');
var path = require('path');
var cors = require('cors');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').config();

var routes = require('./routes');
var users = require('./routes/users');
var alto = require('./routes/Alto');

var app = express();
var db_config = require('./config/db');
var mysql = require('mysql');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var whitelist = require('./.whitelist.js') || ["http://localhost:3000"];

function whitelistedURLs(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

app.use(cors({
    origin: "http://159.203.187.114",
    optionsSuccessStatus: 200
}));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    global.connection = mysql.createConnection(db_config);
    connection.connect(e => {
        if (e) {
            console.error('Database Connection Error: ', e.stack);
        } else {
            console.log('db connected');
        }
    });
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/v1/alto', alto);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
