const mongoose = require('mongoose');

const User = require('../models/user');
const mail = require('./mailService');
const jwt = require('./jwtService');
const status = require('../utils/userStatus');
const role = require('../utils/userRole');
require('dotenv').config();

class Auth {
  static async signIn (email, password) {
    const user = await User.findOne().byEmail(email);
    if (!user) throw new Error('Email not found');
    const checkPassword = await user.comparePassword(password);
    if (checkPassword) {
      return await jwt.generatePairAccessJWT(user._id);
    }
    throw new Error('Password incorrect');
  }; 

  static async signUp (username, email, password) {
    const checkUser = await User.checkUser(email);
    if (checkUser) throw new Error('Email is already registered');
    const user = await User.create({ _id: new mongoose.Types.ObjectId(), 'username': username, 'email': email, 'password': password, 'status': status.signIn, 'role': role.user});
    // return await mail.sendSignInMail(email, await jwt.generateRegistrationJWT(user._id));
    return await jwt.generatePairAccessJWT(user._id);
  };

  static async resendMail (email) {
    const user = await User.checkUser(email);
    if(!user) throw new Error('User not found');
    return await mail.sendSignInMail(email, await jwt.regenerateRegistrationJWT(user._id));
  }

  static async confirm (token) {
    const id = await jwt.verifyJWT(token, process.env.ACCESS);
    // const id = await jwt.verifyJWT(token, `${process.env.ACCESS}`);
    await User.findByIdAndUpdate({'_id':id},{'status':status.confirm});
    return await jwt.generatePairAccessJWT(id);
  }

  static async verifyAdmin (token) {
    const id = await jwt.verifyJWT(token, process.env.ACCESS);
    // const id = await jwt.verifyJWT(token, `${process.env.ACCESS}`);
    const user = await User.findByIdAndUpdate({'_id':id},{'status':status.confirm});
    if (user && user.role === role.admin) {
      return {'message': 'admin status confirmed'};
    } else {
      throw new Error('admin status is not confirmed'); 
    }
    
  }
}

module.exports = Auth;

