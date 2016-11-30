var router = require('express').Router();
var User = require('../models/user');
var User = require('../models/category');

router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  })
})

router.get('/categories', function(req, res) {
  User.find({}, function(err, categories) {
    res.json(categories);
  })
})


module.exports = router;
