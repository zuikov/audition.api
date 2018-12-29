const jwt = require('jsonwebtoken');
const Session = require('../models/Session');
const user = require('../services/userService');
require('dotenv').config();

class JwtService {
  createAccessJWT(id, expires = Math.floor(Date.now() / 1000) + (60 * 30)) {
    return jwt.sign({
      exp: expires,
      data: id
    // }, process.env.ACCESS);
    }, `${process.env.ACCESS}`);
  };

  createRefreshJWT(id, expires = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 60)) {
    return jwt.sign({
      exp: expires,
      data: id
    // }, process.env.REFRESH);
    }, `${process.env.REFRESH}`);
  };

  createRegistrationJWT(id, expires = Math.floor(Date.now() / 1000) + (60 * 60 * 24)) {
    return jwt.sign({
      exp: expires,
      data: id
    // }, process.env.REGISTER);
    }, `${process.env.REGISTER}`);
  };

  async generatePairAccessJWT(id) {
    const accessExpires = Math.floor(Date.now() / 1000) + (60 * 30);
    const refreshExpires = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 60);
    await Session.findByIdAndUpdate(Session.toId(id), {registrationExp: null, accessExp: accessExpires, refreshExp: refreshExpires}, {upsert: true});
    return {
      accessToken: this.createAccessJWT(id, accessExpires),
      refreshToken: this.createRefreshJWT(id, refreshExpires),
    };
  };

  async generateRegistrationJWT(id) {
    const expires = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
    await Session.create({_id: id, registrationExp: expires, count: 0});
    return this.createRegistrationJWT(id, expires);
  };

  async regenerateRegistrationJWT(id) {
    const expires = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
    const session = await Session.findByIdAndUpdate({_id: id, registrationExp: expires});
    user.giveNotice(session);
    return this.createRegistrationJWT(id, expires);
  }

  async verifyJWT(token, key) {
    // console.log('key', key);
    // console.log('token 2', token);
    const decoded = jwt.verify(token, key);
    // console.log('decoded', decoded);
    const user = await Session.findById(Session.toId(decoded.data));
    // console.log('user', user);
    if (!user) throw new Error('User not found');
    if (!(user.Equal(key, decoded.exp))) throw new Error('Token expired');
    // if (user.isBlock) throw new Error('User blocked');
    return user._id;
  };

  async refreshAccessPair(token) {
    // const id = await this.verifyJWT(token, process.env.REFRESH);
    const id = await this.verifyJWT(token, `${process.env.REFRESH}`);
    return await this.generatePairAccessJWT(id);
  }

  async logOut(token) {
    // const id = await this.verifyJWT(token, process.env.ACCESS);
    const id = await this.verifyJWT(token, `${process.env.ACCESS}`);
    return await Session.findByIdAndUpdate(Session.toId(id), {accessExp: null, refreshExp: null});

  }
}

module.exports = new JwtService();
