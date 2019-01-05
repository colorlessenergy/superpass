const User = require('../models/schemas/user');
const bycrpt = require('bcrypt-nodejs');


exports.getUsers = function (req, res, next) {
  // console.log('fetching users');
  User.find({}, (err, users) => {
    if (err) return next(err);
    return res.json(users);
  });
}

exports.getUserById = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(404).send('No user with that ID');
    return res.json(user);
  });
};

exports.createUser = function (req, res, next) {
  console.log('create new user')
  var user = new User(req.body);
  user.save(function (err, user) {
    if (err) {
      if (err.code === 11000) {
        return res.status(400).send('username is in use');
      }

      return next(err);
    }
    return res.sendStatus(200);
  });
}

exports.updateUser = function (req, res, next) {
  let userData = {};

  if (req.body.username) userData.username = req.body.username;

  if (req.body.hash) {
    // hash before saving
    // since mongoose findOneAndUpdate bypasses hooks
    // generate a SALT
    bycrpt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      // pass in null for progress
      bycrpt.hash(user.hash, salt, null, function (err, hash) {
        if (err) return next(err);

        userData.hash = hash;

        next();
      });

    });
  }


  User.findOneAndUpdate(req.user.id, userData, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('No user with that ID');
    return res.sendStatus(200);
  });

}

exports.deleteUser = function (req, res, next) {
  console.log('starting to delete user');
  User.findOneAndRemove(req.user.id, req.body, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('No user with that ID');
    return res.sendStatus(200);
  });
}

