const express = require('express');
const users = require('../controllers/users');
const auth = require('../controllers/auth');
const applications = require('../controllers/application');
const password = require('../controllers/password');
var router = express.Router();


router.route('/')
  .get(function (req, res, next) {
    return res.send('home page');
  });

router.route('/user')
  .get(users.getUsers)

  router.route('/users')
  .post(users.createUser)
  .get(auth.validateUser, users.getUserById)
  .put(auth.validateUser, users.updateUser)
  .delete(users.deleteUser);

router.route('/users/application')
  .get(auth.validateUser, applications.getApplications)
  .post(auth.validateUser, applications.createApplication)
  .delete(auth.validateUser, applications.deleteApplication)
  .put(auth.validateUser, applications.updateApplication);

router.route('/users/password/:app')
  .post(auth.validateUser, password.createPassword);


  // passing the index and app as params so it is faster to find the account.
  // the index is for the array inside the accounts 'arrOfPasswords'
router.route('/users/password/:app/:index')
  .get(auth.validateUser, password.getPasswords)
  .delete(auth.validateUser, password.deletePassword)
  .put(auth.validateUser, password.updatePassword);


router.route('/auth/token')
  .post(auth.loginUser);

module.exports = router;