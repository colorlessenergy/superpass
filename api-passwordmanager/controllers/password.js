const User = require('../models/schemas/user');
const crypto = require('crypto');
const config = require('../models/config');

const key = crypto
  .createHash('sha256')
  .update(String(config.secret))
  .digest();


exports.getPasswords = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    console.log('requesting for the accounts');
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');
    let application = req.params.app;
    let found = false;

    user.passwordsStorage.some(function (obj) {
      if (obj.name === application) {
        found = obj;
        return true;
      }
    });

    if (found) {

      // decrypt password and username before giving to user
      found.arrOfPasswords.forEach(function (obj, i) {
        console.log(obj.password, obj.username, 'DECRYPTING PASSWORDSS');
        found.arrOfPasswords[i].password = decrypt(obj.password);
        found.arrOfPasswords[i].username = decrypt(obj.username);
      });

      console.log(found, 'FOUDN THE ACCOUNT');
      return res.send(found);
    }

    return res.sendStatus(404);
  });
}

exports.createPassword = function (req, res, next) {
  // need username, hash from user
  console.log('started to create password');
  User.findById(req.user.id, function (err, user) {
    if (err) return next (err);
    if (!user) return res.status(404).send('no user with that ID');
    var application = req.params.app;
    var username = req.body.username;
    var hash = req.body.hash;

    // encrypt password before sending to the database;
    hash = encrypt(hash);

    // encrypt username before sending to the database
    username = encrypt(username);


    // find the application trying to create an account for.
    user.passwordsStorage.some(function (obj, i) {
      if (obj.name == application) {
        user.passwordsStorage[i].arrOfPasswords.push({
          username: username,
          password: hash
        });
        return true;
      }
    });

    // tell mongoose there is a change
    user.markModified('passwordsStorage');

    // save the doc
    user.save(function (err, user) {
      if (err) return next(err);
      console.log('finish creating password');
      return res.status(200).send('sucessfully added a new account');
    });
  });
}

exports.updatePassword = function (req, res, next) {
  User.findById(req.user.id, function (err, user) {
    if (err) return next (err);
    if (!user) return res.status(404).send('no user with that ID');
    var index = req.params.index;

    // find the object in the array trying to update
    // username or password
    // need username and password
    console.log('STARTING TO UPDATE PASSWORD');
    user.passwordsStorage.some(function (app, i) {
      if (app.name === req.params.app) {
        if (req.body.username) {
          let username = encrypt(req.body.username);
          user.passwordsStorage[i].arrOfPasswords[index].username = username;
        }
        if (req.body.hash)  {
          let hash = encrypt(req.body.hash);
          user.passwordsStorage[i].arrOfPasswords[index].password = hash;
        }
        return true;
      }
    });

    // tell mongoose there is a change
    user.markModified('passwordsStorage');

    // save the doc
    user.save(function (err, user) {
      if (err) return next(err);
      console.log('sucessfully updated account');
      return res.status(200).send('sucessfully updated an account');
    });
  });
}

exports.deletePassword = function (req, res, next) {
  // will get the account username and password from req.body
  console.log(req.params.index, req.params.app, 'RANNED DELETING PASSWORD');
  User.findById(req.user.id, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(404).send('no user with that ID');
    // look into all the password storage and find the correct one
    user.passwordsStorage.forEach(function (acc, objIndex) {
      if (acc.name === req.params.app) {
        // get account trying to delete

        var account = acc.arrOfPasswords[req.params.index];
        account.username = decrypt(account.username);
        account.password = decrypt(account.password);
        console.log(account)

        if (account.username === req.body.username) {
          // splice the account inside the array of passwords
          if (account.password === req.body.hash) {
            user.passwordsStorage[objIndex].arrOfPasswords.splice(req.params.index, 1);
            return;
          }

          return res.status(403).send('the account information is incorrect');
        }
        return;
      }
    });
    // tell mongoose there is a change
    user.markModified('passwordsStorage');

    // save the doc
    user.save(function (err, user) {
      if (err) return next(err);
      console.log('sucessfully deleted password');
      return res.status(200).send('sucessfully deleted an account');
    });
  });
}

function decrypt (str) {
  const stringValue = String(str);
  const iv = Buffer.from(stringValue.slice(0, 32), 'hex');
  const encrypted = stringValue.slice(32);

  const decipher = crypto.createDecipheriv(config.algorithm, key, iv);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

function encrypt (str) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(config.algorithm, key, iv);
  const encrypted = cipher.update(String(str), 'utf8', 'hex') + cipher.final('hex');

  return iv.toString('hex') + encrypted;
}