const User = require('../models/schemas/user');
const config = require('../models/config.js');
const jwt = require('jsonwebtoken');


exports.loginUser = function (req, res, next) {
  console.log('trying to login a user...');
  if (typeof req.body.username !== 'string')
    return res.status(400).send('Missing username');

  if (typeof req.body.hash !== 'string')
    return res.status(400).send('Missing password');


  User.findOne({username: req.body.username}, function (err, user) {
    console.log('trying to find the user in the database');
    if (err) return next(err);

    if (!user) return res.status(400).send('no user with that username');

    user.comparePassword(req.body.hash, function (err, isMatch) {
      if (err) return next(err);
      if (!isMatch) return res.status(401).send('Incorrect password');


      var payload = {
        id: user._id,
        username: user.username,
        passwordsStorage: user.passwordsStorage
      };

      // create the token

      var token = jwt.sign(payload, config.secret);

      user.token = token;

      user.save(function (err) {
        if (err) return next(err);
        return res.json({token: token});
      });

    });
  });
}

exports.validateUser = function (req, res, next) {
  validateToken(req, res, next);
}

exports.logout = function (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) return res.status(403).send('this endpoint requires a token');


  try {
    var decoded = jwt.verify(token, config.secret);
  } catch (err) {
    return res.status(403).send('Failed to authenticate token');
  }

  User.findById(decoded.id, function (err, user) {
    if (err) return next(err);

    if (!user) return res.status(403).send('Invalid user');

    if (token !== user.token) return res.status(403).send('Expired token');

    user.token = '';

    user.save(function (err, user) {
      if (err) return next(err);
      console.log(user);
      return res.status(200).send('logged out successfully');
    })
  });
}

function validateToken (req, res, next) {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) return res.status(403).send('this endpoint requires a token');


  try {
    var decoded = jwt.verify(token, config.secret);
  } catch (err) {
    return res.status(403).send('Failed to authenticate token');
  }

  User.findById(decoded.id, function (err, user) {
    if (err) return next(err);

    if (!user) return res.status(403).send('Invalid user');

    if (token !== user.token) return res.status(403).send('Expired token');

    req.user = decoded;

    next();
  });
}