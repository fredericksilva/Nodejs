var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'mysql',
  database: 'portfolio'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM projects', function(err, rows, fields){
    if(err) throw err;
    res.render('index', {
      "rows": rows
    });
  });
});

module.exports = router;
