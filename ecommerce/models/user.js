var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');  //for hashing password before saving to db
var crypto = require('crypto');
var Schema = mongoose.Schema;

/* The user schema attributes / characteristics / fields */
var UserSchema = new Schema({

  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: { type: String, default: ''},
    picture: { type: String, default: ''}
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
    // item: { type: Schema.Types.ObjectId, ref: ''}
  }]
});

/*  Hash the password before we even save it to the database */
UserSchema.pre('save', function(next) {
  var user = this;  //referring to UserSchema
  if (!user.isModified('password')) return next(); //checking if password is modified
  bcrypt.genSalt(10, function(err, salt) { //generating 10 char salt
    if (err) return next(err); //check for error
    bcrypt.hash(user.password, salt, null, function(err, hash) { //hahing user pasword with the salt generatred
      if (err) return next(err); //check for error
      user.password = hash; //assign the hashed password to variable 'hash'
      next(); //continue
    });
  });
});

/* compare password in the database and the one that the user type in */
UserSchema.methods.comparePassword = function(password) { //writing custom method 'comparePassword'
  return bcrypt.compareSync(password, this.password); //compare the typed in password to the one in the Schema
}

//using gravatar api for adding profile pic
UserSchema.methods.gravatar = function(size) {
  if (!this.size) size = 200;
  if (!this.email) return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}

module.exports = mongoose.model('User', UserSchema);
