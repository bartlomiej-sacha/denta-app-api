"use strict";

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.sub");

var _users = _interopRequireDefault(require("../models/users"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = require("../config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Validate email address 
function validateEmailAccessibility(email) {
  return _users["default"].findOne({
    email: email
  }).then(function (result) {
    return !result;
  });
} // Generate token 


var generateTokens = function generateTokens(req, user) {
  var ACCESS_TOKEN = _jsonwebtoken["default"].sign({
    sub: user._id,
    rol: user.role,
    type: 'ACCESS_TOKEN'
  }, _config.TOKEN_SECRET_JWT, {
    expiresIn: 120
  });

  var REFRESH_TOKEN = _jsonwebtoken["default"].sign({
    sub: user._id,
    rol: user.role,
    type: 'REFRESH_TOKEN'
  }, _config.TOKEN_SECRET_JWT, {
    expiresIn: 480
  });

  return {
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN
  };
}; // Controller create user 


exports.createUser = function (req, res, next) {
  validateEmailAccessibility(req.body.email).then(function (valid) {
    if (valid) {
      _users["default"].create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }, function (error, result) {
        if (error) next(error);else res.json({
          message: 'The user was created'
        });
      });
    } else {
      res.status(409).send({
        message: "The request could not be completed due to a conflict"
      });
    }
  });
}; // Controller login user 


exports.loginUser = function (req, res, next) {
  console.log(req.body.email);

  _users["default"].findOne({
    email: req.body.email
  }, function (err, user) {
    if (err || !user) {
      res.status(401).send({
        message: "Unauthorized"
      });
      next(err);
    } else {
      if (_bcrypt["default"].compareSync(req.body.password, user.password)) {
        console.log(_bcrypt["default"].compareSync(req.body.password, user.password));
        res.json(generateTokens(req, user));
      } else {
        res.status(401).send({
          message: "Invalid email/password"
        });
      }
    }
  }).select('password');
}; // Verify accessToken 


exports.accessTokenVerify = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: 'Token is missing'
    });
  }

  var BEARER = 'Bearer';
  var AUTHORIZATION_TOKEN = req.headers.authorization.split(' ');

  if (AUTHORIZATION_TOKEN[0] !== BEARER) {
    return res.status(401).send({
      error: "Token is not complete"
    });
  }

  _jsonwebtoken["default"].verify(AUTHORIZATION_TOKEN[1], _config.TOKEN_SECRET_JWT, function (err) {
    if (err) {
      return res.status(401).send({
        error: "Token is invalid"
      });
    }

    next();
  });
}; // Verify refreshToken 


exports.refreshTokenVerify = function (req, res, next) {
  if (!req.body.refreshToken) {
    res.status(401).send({
      message: "Token refresh is missing"
    });
  }

  var BEARER = 'Bearer';
  var REFRESH_TOKEN = req.body.refreshToken.split(' ');

  if (REFRESH_TOKEN[0] !== BEARER) {
    return res.status(401).send({
      error: "Token is not complete"
    });
  }

  _jsonwebtoken["default"].verify(REFRESH_TOKEN[1], _config.TOKEN_SECRET_JWT, function (err, payload) {
    if (err) {
      return res.status(401).send({
        error: "Token refresh is invalid"
      });
    }

    _users["default"].findById(payload.sub, function (err, person) {
      if (!person) {
        return res.status(401).send({
          error: 'Person not found'
        });
      }

      return res.json(generateTokens(req, person));
    });
  });
};