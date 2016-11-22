var express = require('express'); //requiring the express library which must be installed

var app = express(); //assigning app variable to the express module for reference

app.listen(3000, function(err) {	// assigning port to the express library and  creating error validation optionally
	if (err) throw err;
	console.log("Server is running on port 3000");
});