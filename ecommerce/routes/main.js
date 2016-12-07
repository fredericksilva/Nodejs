var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');

function paginate(req, res, next) {

  var perPage = 9;
  var page = req.params.page;

  Product
    .find()
    .skip( perPage * page)
    .limit( perPage )
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      Product.count().exec(function(err, count) {
        if (err) return next(err);
        res.render('main/product-main', {
          products: products,
          pages: count / perPage
        });
      });
    });

}

Product.on('es-bulk-sent', function () {
  console.log('buffer sent');
});

Product.on('es-bulk-data', function (products) {
  console.log('Adding ' + products.name);
});

Product.on('es-bulk-error', function (err) {
  console.error(err);
});

Product
  .esSynchronize()
  .then(function () {
    console.log('end.');
  });

  //search routes to post the string
  router.post('/search', function(req, res, next) {
    res.redirect('/search?q=' + req.body.q);
  });

//search routes to get the search query result
router.get('/search', function(req, res, next) {
  if (req.query.q) {
    Product.esSearch({
      query_string: { query: req.query.q}
    }, function(err, results) {
      results:
      if (err) return next(err);
      var products = results.hits.hits.map(function(hit) {
        return hit;
      });
      res.render('main/search-result', {
        query: req.query.q,
        products: products         //data is the object sent to the form
      });
    });
  }
});

//route to homepage
router.get('/', function(req, res, next) {
  
  if (req.user) {
    paginate(req, res, next); //calling the paginate function above
 } else {
   res.render('main/home');
 }
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/page/:page', function(req, res, next) {
  paginate(req,res,next);
});

//find by categoryId
router.get('/products/:id', function(req, res, next) {
  Product
    .find({ category: req.params.id })
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      res.render('main/category', {
        products: products    //products is theh object that feed the form
      });
    });
});

//find by productId
router.get('/product/:id', function(req, res, next) {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return next(err);
    res.render('main/product', {
      product: product          //product is theh object that feed the form
    });
  });
});


module.exports = router;
