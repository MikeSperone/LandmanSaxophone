var express = require('express');
var expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/auth').passport;

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

const app = express();
const db_config = require('./config/db');
const mysql = require('mysql');
const flash = require('connect-flash');

// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');

var whitelist =["http://localhost:3000", "http://localhost:3001"];
try {
    whitelist = require('./.whitelist.js');
} catch (e) {}

function whitelistedURLs(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

const myCors = cors({
    origin: whitelistedURLs,
    optionsSuccessStatus: 200
});
// app.use(cors({
//     origin: whitelistedURLs,
//     optionsSuccessStatus: 200
// }));

app.use(favicon());
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    global.connection = mysql.createConnection(db_config);
    connection.connect(e => {
        if (e) {
            // TODO: log error to file
            console.error('Database Connection Error: ', e.stack);
        } else {
            console.log('db connected');
            process.on('SIGINT', function() {
                connection.end(function(err) {
                    process.exit(err ? 1 : 0);
                });
            });
        }
    });
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/v1/alto', myCors, alto);

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
// TODO: create an error page
app.use(function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.status || 500,
        error: {}
    });
});


module.exports = app;
