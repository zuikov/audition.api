const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

mongoose.Promise = global.Promise;
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // name: {
  //   firstName: String,
  //   lastName: String,
  // },
  username: {
    firstName: String,
    lastName: String,
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/]
  },
  hashPassword: {
    hash: String,
    salt: String
  },
  role: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  collection: 'users',
  versionKey: false

});

userSchema.query.byEmail = function (email) {
  return this.where({'email': email});
};

userSchema.query.findByEmail = function (email) {
  return this.where({'email': new RegExp(email, 'i')});
};

userSchema.query.findByFullName = function (firstName, lastName) {
  return this.where({username: {$firstName: new RegExp(firstName, 'i'), $lastName: new RegExp(lastName, 'i')}});
};

userSchema.statics.checkUser = async function (email) {
  const user = await this.findOne({email:email});
  return user? user._id: null;
};

userSchema.methods.setStatus = function(status){
  this.status = status;
};

userSchema.virtual('fullName')
  .get(() => {
    return this.username.firstName + ' ' + this.username.lastName;
  })
  .set(function (v) {
    this.username.firstName = v.substr(0, v.indexOf(' '));
    this.username.lastName = v.substr(v.indexOf(' ') + 1);
  });

userSchema.methods.comparePassword = async function (password) {
  return this.hashPassword.hash === crypto.pbkdf2Sync(password, this.hashPassword.salt + process.env.SALT, 10000, 256, 'sha256').toString('hex');
  // return this.hashPassword.hash === crypto.pbkdf2Sync(password, this.hashPassword.salt + `${process.env.SALT}`, 10000, 256, 'sha256').toString('hex');
};
userSchema.virtual('password').set(function (password) {
  this.hashPassword.salt = crypto.randomBytes(128).toString('base64');
  this.hashPassword.hash = crypto.pbkdf2Sync(password, this.hashPassword.salt + process.env.SALT, 10000, 256, 'sha256').toString('hex');
  // this.hashPassword.hash = crypto.pbkdf2Sync(password, this.hashPassword.salt + `${process.env.SALT}`, 10000, 256, 'sha256').toString('hex');
});

module.exports = mongoose.model('User', userSchema);