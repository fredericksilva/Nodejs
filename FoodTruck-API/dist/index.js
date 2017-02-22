'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Create the app
var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

//middleware

//passport config


//api routes v1
app.use('/v1, routes'); //direct all calls to.. v1 to routes

app.server.listen(_config2.default.port); //setting the port to whats in config file
console.log('Server started on port ${app.server.address().port}');

exports.default = app;
//# sourceMappingURL=index.js.map