var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session)

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
			url:config.dbURL,
			// mongoose_connection:mongoose.connections[0],
			stringify:true,
			saveUninitialized:true,
			resave:true
		})
	}))
}

require('./routes/routes.js')(express, app);

app.listen(3000, function(){
	console.log('ChatApp Working on Port 3000');
})