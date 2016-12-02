var router = require('express').Router();
var Product = require('../models/product');

Product.createMapping(function(err, mapping) {  //map the product db to elastic search relica
  if (err) {
    console.log("error creating mapping");
    console.log(err);
  } else {
    console.log("Mapping created");
    console.log(mapping);

  }
});

//stream the data from mongodb product to elasticsearch product db
var stream = Product.synchronize();
var count = 0;

stream.on('data', function() {    //count the number of document
  count++;
});

stream.on('close', function() {   //output the number of documents
  console.log("Indexed " + count + " documents");
});

stream.on('error', function(err) {
  console.log(err);
});

//search routes
router.post('/search', function(req, res, next) {
  res.redirect('/search?q=' + req.body.q);
});

router.get('/search', function(req, res, next) {
  if (req.query.q) {
    Product.search({
      query_string: { query: req.query.q}
    }, function(err, results) {
      results:
      if (err) return next(err);
      var data = results.hits.hits.map(function(hit) {
        return hit;
      });
      res.render('main/search-result', {
        query: req.query.q,
        data: data          //data is the object sent to the form
      });
    });
  }
});

//route to homepage
router.get('/', function(req, res) {
  res.render('main/home');
});

router.get('/about', function(req, res) {
  res.render('main/about');
});

router.get('/products/:id', function(req, res, next) {
  Product
    .find({ category: req.params.id })  //find by categoryId
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      res.render('main/category', {
        products: products    //products is theh object that feed the form
      });
    });
});

router.get('/product/:id', function(req, res, next) {
  Product.findById({ _id: req.params.id }, function(err, product) {   //find by productId
    if (err) return next(err);
    res.render('main/product', {
      product: product          //product is theh object that feed the form
    });
  });
});


module.exports = router;
