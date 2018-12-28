const jwt = require('../services/jwtService');
const auth = require('../services/authService');
require('dotenv').config();

class AuthController {
  static signIn(request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    auth.signIn(request.body.email, request.body.password)
      .then(tokens => response.send(tokens))
      .catch(err => response.status(401).send(`${err}`));
  };

  static getNewAccessPair(request, response) {
    jwt.refreshAccessPair(request.headers.authorization)
      .then(tokens => response.send(tokens))
      .catch(err => response.status(401).send(`${err}`));
  };

  static signUp(request, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    auth.signUp(request.body.username, request.body.email, request.body.password)
      .then(tokens => response.send(tokens))
      .catch(err => response.status(500).send(`${err}`));
  };

  static resendMail (request, response) {
    auth.resendMail(request.body.email)
      .then(() => response.send('Mail resended'))
      .catch(err => response.status(500).send(`${err}`));
  };

  static getAccessPairForNewUser(request, response) {
    auth.confirm(request.body.token)
      .then(tokens => response.send(tokens))
      .catch(err => response.status(401).send(`${err}`));
  };

  static logOut(request, response) {
    jwt.logOut(request.headers.token)
      .then(() => response.send('Session is finished'))
      .catch(err => response.status(500).send(`${err}`));
  }

  static verifyAdmin(request, response) {
    auth.verifyAdmin(request.headers.authorization)
      .then(message => response.send(message))
      .catch(err => response.status(401).send(`${err}`));
  };
}

module.exports = AuthController;
