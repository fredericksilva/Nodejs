var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = []

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
//app.use(session({secret:'catscanfly', saveUninitialized:true, resave:true}));
var env = process.env.NODE_ENV || 'production';
if(env === 'development'){
	// dev specific settings
	app.use(session({secret:config.sessionSecret,saveUninitialized:true, resave:true}))
} else {
	//production specific settings
	app.use(session({
		secret:config.sessionSecret,
		store: new ConnectMongo({
			// url:config.dbURL,
			mongooseConnection:mongoose.connections[0],
			stringify:true,
			saveUninitialized:true,
			resave:true
		})
	}))
}

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app, passport, config, rooms);

// app.listen(3000, function(){
// 	console.log('ChatApp Working on Port 3000');
// 	console.log('Mode: ' + env);

app.set('port', 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);
server.listen((process.env.PORT || 3000), function(){
	console.log('ChatAPP on Port : ' + app.get('port'));
})