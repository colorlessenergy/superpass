const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');


const config = require('./app/models/config');
const router = require('./routes/index');

var app = express();
if (app.get('env') === 'development') app.locals.dev = true;

app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'pug');

// process forms and throw into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// tell node to expose and look in the public folder
app.use(express.static(path.join(__dirname, 'public')));

// logs request
if (app.locals.dev) app.use(morgan('dev'));

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
if (app.locals.dev) {
  app.use((err, req, res, next) => {
      if (err.status !== 404) console.log(err);
      res.status(err.status || 500).send();
  });
}

app.use((err, req, res, next) => res.status(err.status || 500).send());

app.listen(config.port, function() {
  console.log('listening on port 3000')
});