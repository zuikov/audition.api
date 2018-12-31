const mongoose = require('mongoose');
mongoose.connect(`${process.env.MONGOLAB_URI}`,{ useNewUrlParser: true })
  .then(() => {
    console.log('Successfully connected to data base "usersdb"');}, err => {
      console.log('Unsuccessfully connected to data base "usersdb"');
      if (err) throw err;
});
