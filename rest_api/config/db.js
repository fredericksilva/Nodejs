var db = require('mongoose');

db.connect('mongodb://test:pass@ds021663.mlab.com:21663/workouts')

module.exports = db;
