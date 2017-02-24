import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from './config';
import routes from './routes';

//Create the app
let app = express();
app.server = http.createServer(app);

//middleware
//parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

//passport config
app.use(passport.initialize());   //initialize passport
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',     //map usernameField to email field in the model
  passwordField: 'password'   //mapp passwordField to password field in the model
},
  Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//api routes v1
app.use('/v1', routes);   //direct all calls to.. v1 to routes

app.server.listen(config.port); //setting the port to whats in config file
console.log(`Server started on port ${app.server.address().port}`);

export default app;
