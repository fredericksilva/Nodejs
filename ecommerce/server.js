var express = require('express'); //requiring the express library which must be installed
var morgan = require('morgan'); //logging user requests
var mongoose = require('mongoose');

var app = express(); //assigning app variable to the express module for reference to the method

//connect to mongolab db
mongoose.connect('mongodb://root:arinola@ds163387.mlab.com:63387/ecommerce', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
  }
});

//Middleware to invoke morgan
app.use(morgan('dev'));

app.get('/', function(req, res) {
	var name = "L3xy";
	res.json("My name is " + name);
});

app.get('/catname', function(req, res) {
	res.json('batman');
});

app.listen(3000, function(err) {	// assigning port to the express library and  creating error validation optionally
	if (err) throw err;
	console.log("Server is running on port 3000");
});
