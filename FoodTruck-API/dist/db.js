'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callback) {
  var db = _mongoose2.default.connect(_config2.default.mongoUrl); //referencing the mongoUrl property of the default object in the config folder
  callback(db); //passing db back to whereevr its being imported
};
//# sourceMappingURL=db.js.map