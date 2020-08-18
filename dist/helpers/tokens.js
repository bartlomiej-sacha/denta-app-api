"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTokens = exports.secret = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var secret = {
  TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT || 'jWt9982_s!tokenSecreTqQrtw'
};
exports.secret = secret;

var generateTokens = function generateTokens(req, user) {
  var ACCESS_TOKEN = _jsonwebtoken["default"].sign({
    data: user,
    type: 'ACCESS_TOKEN'
  }, secret.TOKEN_SECRET_JWT, {
    expiresIn: 1200
  });

  return {
    accessToken: ACCESS_TOKEN
  };
};

exports.generateTokens = generateTokens;