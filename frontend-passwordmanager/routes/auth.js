var jwt = require('jsonwebtoken');
var config = require('../app/models/config');

exports.userRequired = function (req, res, next) {
  validateToken(req, res, next);
}

function validateToken (req, res, next) {
  console.log('inserted into the validateToken function validating token...')
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.token;


  if (!token) {
    return res.redirect(403, '/logout');
  }


  try {
    var decoded = jwt.verify(token, config.secret);
  } catch (err) {
    return res.redirect(403, '/logout');
  }


  if (!decoded.id) return res.redirect(403, '/logout');

  req.user = decoded;
  req.token = token;

  console.log('finish authenticating token frontend')

  next();
}