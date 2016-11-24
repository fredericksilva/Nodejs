var express = require('express'); //requiring the express library which must be installed
var morgan = require('morgan'); // for logging user requests
var mongoose = require('mongoose'); //for processing db connection
var bodyParser = require('body-parser'); //for parsing request data in whateve format
var ejs = require('ejs');
var engine = require('ejs-mate');

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
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//Route to create user
app.post('/create-user', function(req, res, next) {
	var user = new User(); //create a new object of the User class above

	user.profile.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;

	user.save(function (err) {
		if (err) return next(err);
		res.json('Successfully created a new user');
	});
});

app.get('/', function(req, res) {
	res.render('home');
});

// app.get('/', function(req, res) {
// 	var name = "L3xy";
// 	res.json("My name is " + name);
// });
//
// app.get('/catname', function(req, res) {
// 	res.json('batman');
// });

app.listen(3000, function(err) {	// assigning port to the express library and  creating error validation optionally
	if (err) throw err;
	console.log("Server is running on port 3000");
});
