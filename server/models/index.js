const mongoose = require('mongoose');
mongoose.connect('mongodb://projectsupport:q123456@ds235732.mlab.com:35732/projectsupport',{ useNewUrlParser: true }).then(() => {  console.log('Successfully connected to data base "usersdb"');}, err => {
  console.log('Unsuccessfully connected to data base "usersdb"');
  if (err) throw err;
});
