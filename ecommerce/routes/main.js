var router = require('express').Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require('../models/cart');

var async = require('async');

var stripe = require('stripe') ('sk_test_XLFA6HPMji6FlwL1KGLtUKVO');

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

router.get('/cart', function(req, res, next) {
  Cart
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        message: req.flash('remove') //add msg
      });
    });
});

//route to add product to cart
router.post('/product/:product_id', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, cart) {   //find the owner of the cart
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

    cart.save(function(err) {
      if (err) return next(err);
      return res.redirect('/cart');
    });
  });
});

//remove route
router.post('/remove', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.body.item));

    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    foundCart.save(function(err, found) {
      if (err) return next(err);
      req.flash('remove', 'Successfully removed');
      res.redirect('/cart');
    });
  });
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

//Payment route
router.post('/payment', function(req, res, next) {

  var stripeToken = req.body.stripeToken; //get the stripe tken from the client
  var currentCharges = Math.round(req.body.stripeMoney * 100);  //convert to cents by stripes rule
  stripe.customers.create({
    source: stripeToken,
  }).then(function(customer) {      //use stripe function to create a customer
    return stripe.charges.create({
      amount: currentCharges,
      currency: 'usd',
      customer: customer.id
    }, function(err, currentCharges) {
      console.log(err);
    });
  }).then(function(charge) {
    async.waterfall([
      function(callback) {
        Cart.findOne({ owner: req.user._id }, function(err, cart) {
          callback(err, cart);  //Search the cart owner and pass it to the next function with the callback
        });
      },
      function(cart, callback) {
        User.findOne({ _id: req.user._id }, function(err, user) { //Search for the login user
          if (user) {
            for (var i = 0; i < cart.items.length; i++) { //if user exist, loop through the cart item and price and push into history
              user.history.push({
                item: cart.items[i].item,
                paid: cart.items[i].price
              });
            }

            user.save(function(err, user) {
              if (err) return next(err);  //If theres error, return a callback with an error
              callback(err, user);    //Pass the user object to the next funtion
            });
          }
        });
      },
      function(user) {
        Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) { //empty cart
          if (updated) {
            res.redirect('/profile');
          }
        });
      }
    ]);
  });


});


module.exports = router;
