const User = require('../models/schemas/user');

exports.getApplications = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');
    return res.send(user.passwordsStorage);
  });
}

exports.createApplication = function (req, res, next) {
  // need req.body.newApplication to create a new application

  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');
    let passwordsStorage = {};

    if (user.passwordsStorage.length === 0) {
      // initialize
      passwordsStorage.name = req.body.newApplication;
      passwordsStorage.arrOfPasswords = [];

    } else {
      user.passwordsStorage.forEach(passwordObj => {
        if (passwordObj.name === req.body.newApplication) {
          return;
        }
        passwordsStorage.name = req.body.newApplication;
        passwordsStorage.arrOfPasswords = [];
      });
    }

    user.passwordsStorage.push(passwordsStorage);

    user.save(function (err, user) {
      if (err) return next(err);
      return;
    });

    return res.send(user.passwordsStorage);
  });
}

exports.deleteApplication = function (req, res, next) {
  // need 'applicationName' from user.
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');

    user.passwordsStorage.some(function (obj, i) {
      if (obj.name === req.body.applicationName) {
        user.passwordsStorage.splice(i, 1);
        return true;
      }
    });

    user.save(function (err, user) {
      if (err) next(err);

      return res.status(200).send('sucessfully deleted the application');
    });
  });
}


exports.updateApplication = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');

    user.passwordsStorage.forEach(function (obj, i) {
      if (obj.name === req.body.applicationName) {
        user.passwordsStorage[i].name = req.body.changeName;
        console.log(user.passwordsStorage);
        return;
      }
    });

    // https://www.freecodecamp.org/forum/t/mongoose-save-is-not-working/100836/3
    // have to tell mongoose that passwordstorage needs to be updated
    user.markModified('passwordsStorage');

    user.save(function (err, user) {
      if (err) return next(err);
      return res.status(200).send('sucessfully changed application name');
    });
  });
}