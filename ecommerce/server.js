var express = require('express'); //requiring the express library which must be installed
var morgan = require('morgan'); // for logging user requests
var mongoose = require('mongoose'); //for processing db connection
var bodyParser = require('body-parser'); //for parsing request data in whateve format
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session); //MongoStore library depend on express session
var passport = require('passport');

var secret = require('./config/secret'); //importing the scret file in the config folder
var User = require('./models/user'); //importing the User schema in the user model

var app = express(); //assigning app variable to the express module for reference to the method

//connect to mongolab db
mongoose.connect(secret.database, function(err) {   //reference the secret config key
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

//Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(secret.port, function(err) {	// assigning port to the express library and  creating error validation optionally
	if (err) throw err;
	console.log("Server is running on port " + secret.port);
});
