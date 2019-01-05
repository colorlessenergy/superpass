const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../app/models/config');
const auth = require('./auth');


router.get('/', function (req, res, next) {
  return res.render('index');
});

router.get('/register', function (req, res, next) {
  return res.render('register');
});

router.post('/register', function (req, res, next) {
  return request.post(config.apiUrl + '/users', { form: req.body }).pipe(res);
})

router.get('/login', function (req, res, next) {
  return res.render('login');
});

router.post('/login', function (req, res, next) {
  return request.post(config.apiUrl + '/auth/token', { form: req.body }).pipe(res);
});

router.get('/logged', auth.userRequired, function (req, res, next) {
  return res.redirect('/users/applications?token=' + req.token);
});

router.get('/users/applications', auth.userRequired, function(req, res, next) {
  console.log('about to request the applications from the database', req.token);
  // fetch all applications from database
  return request.get(config.apiUrl + '/users/application?token=' + req.token, function (error, response, body) {
    console.log(JSON.parse(body))
    return res.render('applications', {
      token: req.token,
      app: JSON.parse(body)
    });
  });

});

router.get('/users/createapplication', function (req, res, next) {
  return res.render('createapplication');
});

router.post('/users/createapplication', auth.userRequired, function (req, res, next) {
  console.log('creating a new application');
  return request.post(config.apiUrl + '/users/application?token=' + req.token, {
    form: req.body
  }).pipe(res);
});

router.get('/users/deleteapplication', auth.userRequired, function (req, res, next) {
  return res.render('deleteapplication');
});

router.delete('/users/deleteapplication', auth.userRequired, function (req, res, next) {
  return request.delete(config.apiUrl + '/users/application?token=' + req.token, {
      form: req.body
    }).pipe(res);
});

router.get('/users/updateapplication/:app', auth.userRequired, function (req, res, next) {
  return res.render('updateapplication', {
    id: req.params.app
  });
});

router.put('/users/updateapplication', auth.userRequired, function (req, res, next) {
  return request.put(config.apiUrl + '/users/application?token=' + req.token, {
      form: req.body
    }).pipe(res);
});

//==================================
//
// routes for the user passwords
//
//===================================

router.get('/users/passwords/:app/:index', auth.userRequired, function (req, res, next) {
  // console.log(req.token)
  return request.get(config.apiUrl + '/users/password/' + req.params.app + '/' + req.params.index + '?token=' + req.token, function (error, response, body) {
    console.log(body);
    var parseJSON = JSON.parse(body);
    return res.render('passwords', {
      appName: parseJSON.name,
      body: parseJSON.arrOfPasswords,
      token: req.token
    });
  });

});


router.get('/users/createpassword/:app', function (req, res, next) {
  // console.log('creating a new password');
  return res.render('createpassword', {
    appname: req.params.app
  });
});

router.post('/users/createpassword/:app', auth.userRequired, function (req, res, next) {
  console.log('creating a new password');
  return request.post(config.apiUrl + '/users/password/' + req.params.app +'?token=' + req.token, {
    form: req.body
  }).pipe(res);
});

router.get('/users/deletepassword/:app/:index', auth.userRequired, function (req, res, next) {
  // console.log(req.params.index)
  return res.render('deletepassword', {
    index: req.params.index,
    appName: req.params.app
  });
});

router.delete('/users/deletepassword/:app/:index', auth.userRequired, function (req, res, next) {
  console.log('deleting password')
  return request.delete(config.apiUrl + '/users/password/' + req.params.app +'/' + req.params.index + '?token=' + req.token, {
      form: req.body
    }).pipe(res);
});

router.get('/users/updatepassword/:app/:index', auth.userRequired, function (req, res, next) {
  // console.log(req.params.index)
  return res.render('updatepassword', {
    index: req.params.index,
    appName: req.params.app
  });
});

router.put('/users/updatepassword/:app/:index', auth.userRequired, function (req, res, next) {
  console.log('updating password')
  return request.put(config.apiUrl + '/users/password/' + req.params.app +'/' + req.params.index + '?token=' + req.token, {
      form: req.body
    }).pipe(res);
});





module.exports = router;