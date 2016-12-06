var mongoose = require('mongoose');
var mexp = require('mongoose-elasticsearch-xp');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  name: String,
  price: Number,
  image: String
});

ProductSchema.plugin(mexp);

module.exports = mongoose.model('Product', ProductSchema);
