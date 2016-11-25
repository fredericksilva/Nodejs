var express = require('express'); //requiring the express library which must be installed
var morgan = require('morgan'); // for logging user requests
var mongoose = require('mongoose'); //for processing db connection
var bodyParser = require('body-parser'); //for parsing request data in whateve format
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

var User = require('./models/user'); //importing the User schema in the user model
var app = express(); //assigning app variable to the express module for reference to the method

//connect to mongolab db
mongoose.connect('mongodb://root:arinola@ds163387.mlab.com:63387/ecommerce', function(err) {
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
  secret: "L3xy",
}));
app.use(flash());

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(userRoutes);


app.listen(3000, function(err) {	// assigning port to the express library and  creating error validation optionally
	if (err) throw err;
	console.log("Server is running on port 3000");
});
