'use strict';

let config = require('app/config/config');
let path = require('path');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let exphbs = require('express3-handlebars');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);

let expressValidator = require('express-validator');
let passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let authMiddleware = require('app/lib/authentication_middleware');

let serviceLocator = require('app/config/di').create();
let passportAuthentication = serviceLocator.get('passportAuthentication');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    extname: '.handlebars',
    helpers: require('./public/js/handlebar-helpers'), // same file that gets used on our client
    partialsDir: 'views/partials/', // same as default, I just like to be explicit
    layoutsDir: 'views/layouts/' // same as default, I just like to be explicit
}));

app.set('view engine', 'handlebars');

// App setup and Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.web.stock_request_service_url);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

//handle sessions
app.use(cookieParser());
app.use(session({
    secret: config.session.secret,
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        db: parseInt(config.redis.database)
    }),
    resave: false,
    saveUninitialized: false
}));

//validation
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        let namespace = param.split('.');
        let root = namespace.shift();
        let formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
          param: formParam,
          msg: msg,
          value: value
      };
    }
}));

//flash messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => passportAuthentication.serializeUser(user, done));
passport.deserializeUser((id, done) => passportAuthentication.deserializeUser(id, done));
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => passportAuthentication.localStrategy(email, password, done))
);

app.use(authMiddleware);

// Make all routes available
require('app/config/routes')(app, serviceLocator);

// Handle 404 error
app.use(function(req, res) {
    res.status(400).render('404', { layout: 'error', pageTitle: 'Page not found' });
});

app.listen(config.web.port, () => {
    console.log('Server running on port: ', config.web.port);
});
