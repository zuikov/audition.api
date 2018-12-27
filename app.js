const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const mainRoutes = require('./server/routes/main');
const homeRoute = require('./server/routes/index');

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cors());
app.options('*', cors()); 
require('dotenv').config();

// set up mongoose
mongoose.connect(`${process.env.MONGODB}`,{ useNewUrlParser: true })
  .then(()=> {
    console.log('process.env.MONGODB', process.env.MONGODB);
  })
  .catch((error)=> {
  });
mongoose.Promise = global.Promise;

// set up port
const port = process.env.PORT || 7066;

// set up route
homeRoute(app);

app.use('/api/', mainRoutes);

app.get('*', (req, res) => {
  res.status(400).json({
    message: 'This is Audition Project. Please see documentation for the proper routes.'
  });
});

app.listen(port);

module.exports = app;