const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bycrpt = require('bcrypt-nodejs');

var userSchema = new Schema({
  username: {type: String, trim: true},
  hash: {type: String, trim: true},
  token: String,
  passwordsStorage: { type: Array }
});

// hash password before save
userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it is modifed or new
  if (!user.isModified('hash')) return next();

  // generate a SALT
  bycrpt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // pass in null for progress
    bycrpt.hash(user.hash, salt, null, function (err, hash) {
      if (err) return next(err);

      user.hash = hash;

      next();
    });

  });
});

// compare passwords

userSchema.methods.comparePassword = function (pw, callback) {
  bycrpt.compare(pw, this.hash, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  })
}

var User = mongoose.model('User', userSchema);

module.exports = User;