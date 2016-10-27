var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session')

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({secret:'catscanfly', saveUninitialized:true, resave:true}));

require('./routes/routes.js')(express, app);

app.listen(3000, function(){
	console.log('ChatApp Working on Port 3000');
})