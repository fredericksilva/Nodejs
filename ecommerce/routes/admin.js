var router = require('express').Router();
var Category = require('../models/category'); //import the category schema

//retrieve the page
router.get('/add-category', function(req, res, next) {
  res.render('admin/add-category', { message: req.flash('success') });
});

//daving category to the db
router.post('/add-category', function(req, res, next) {
  var category = new Category(); //instantiate a new object of the category schema
  category.name = req.body.name; //retrieve form content

  category.save(function(err) {
    if (err) return next(err);
    req.flash('success', 'Successfully added a category');
    return res.redirect('/add-category');
  });
})


module.exports = router;
