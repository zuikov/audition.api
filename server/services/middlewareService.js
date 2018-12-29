const jwt = require('./jwtService');
require('dotenv').config();

class middlewareService {
  static authorisation (request, response, next) {
    // jwt.verifyJWT(request.headers.authorization, process.env.ACCESS)
    jwt.verifyJWT(request.headers.authorization, `${process.env.ACCESS}`)
      .then(id => {
        request.id = id;
        next();
      })
      .catch(e => {
        console.log('e', e);
        response.status(401).end(`${e}`)
      })
  };
}

module.exports = middlewareService;
