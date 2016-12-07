var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var User = require('../models/user');
var Product = require('../models/product');

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  })
})

router.get('/categories', function(req, res) {
  Category.find({}, function(err, categories) {
    res.json(categories);
  })
})

//Search API
router.post('/search', function(req, res, next) {
  console.log(req.body.search_term);
  Product.esSearch({
    query_string: { query: req.body.search_term }
  }, function(err, results) {
    if (err) return next(err);
    res.json(results);
  });
});


router.get('/:name', function(req, res, next) {
    async.waterfall([
      function(callback) {
        Category.findOne({ name: req.params.name }, function(err, category) {
          if (err) return next(err);
          callback(null, category);
        });
      },

      function(category, callback) {
        for (var i = 0; i < 30; i++) {
          var product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price = faker.commerce.price();
          product.image = faker.image.image();

          product.save();
        }
      }
    ]);
    res.json({ message: 'Success' });
});

module.exports = router;
