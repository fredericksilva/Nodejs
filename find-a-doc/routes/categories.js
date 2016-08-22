var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('category');
});

router.get('/add', function(req, res, next) {
  res.render('addcategory');
});


module.exports = router;