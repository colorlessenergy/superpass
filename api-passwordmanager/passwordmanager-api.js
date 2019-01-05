const express = require('express');
const config = require('./models/config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// connect to the database

mongoose.connect(config.dbUrl, { useNewUrlParser: true, keepAlive: 120 })
  .then(function (res) {
    return console.log('connected');
  })
  .catch(function (err) {
    return console.log(err)
  });

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// separate routes to external router
const routes = require('./routes/index');

app.use('/', routes);

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500).send();
  });
}

// production error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send();
});


app.listen(config.port, function () {
  console.log('listening on port ' + config.port + ' on the environment ' + app.get('env'))
});