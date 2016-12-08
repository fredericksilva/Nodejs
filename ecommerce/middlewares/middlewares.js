var Cart = require('../models/cart');


module.exports = function(req, res, next) {

  if (req.user) {           //check is a logged in user
    var total = 0;          // use var to store the total of the product 
    Cart.findOne({ owner: req.user._id }, function(err, cart) { //check if this is the owner of the cart
      if (cart) {
        for (var i = 0; i < cart.items.length; i++) {   //getting the total of product quantity
          total += cart.items[i].quantity;      //calculating total product based on quantity
        }
        res.locals.cart = total;
      } else {
        res.locals.cart = 0;
      }
      next();
    })
  } else {
    next();
  }
}
