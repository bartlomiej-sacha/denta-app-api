"use strict";

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connection = _interopRequireDefault(require("../helpers/connection"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _tokens = require("../helpers/tokens");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _appointments = _interopRequireDefault(require("./appointments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var usersRouter = _express["default"].Router({
  mergeParams: true
});

usersRouter.use('/:userId/appointments', _appointments["default"]); //callback for route parameter which attaches user returned from database to request object

usersRouter.param('userId', function (req, res, next, userId) {
  _connection["default"].query("SELECT * FROM users WHERE users.id = '".concat(userId, "'"), function (error, user) {
    if (error) {
      return res.status(500).json(error);
    } else if (user) {
      req.user = user;
      next();
    } else {
      return res.sendStatus(404);
    }
  });
}); //splits authorization header and attaches decoded token to request object

function verifyToken(req, res, next) {
  var bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    var bearer = bearerHeader.split(' ');
    var bearerToken = bearer[1];

    var decoded = _jsonwebtoken["default"].verify(bearerToken, _tokens.secret.TOKEN_SECRET_JWT);

    req.decodedToken = decoded;
    next();
  } else {
    // Forbidden
    return res.sendStatus(403);
  }
} //return decoded token


usersRouter.get('/profile', verifyToken, function (req, res) {
  res.status(200).json({
    response: req.decodedToken.data
  });
}); //handle response for user logging

usersRouter.post("/login", function (req, res, next) {
  var _req$body = req.body,
      user_name = _req$body.user_name,
      password = _req$body.password;

  if (!user_name || !password) {
    return res.status(500).json({
      response: 'Please fill input fields!'
    });
  }

  _connection["default"].query("SELECT * FROM users WHERE user_name = '".concat(user_name, "'"), function (error, results, fields) {
    if (error) {
      return res.status(404);
    }

    try {
      var hash = results[0].password;

      if (_bcrypt["default"].compareSync(password, hash)) {
        var tokens = (0, _tokens.generateTokens)(req, user_name);
        res.cookie('token', tokens, {
          httpOnly: true
        });
        res.json({
          tokens: tokens,
          response: "Login sucessful!",
          id: results[0].id
        });
      } else {
        res.status(404).json({
          error: "Wrong password!"
        });
      }
    } catch (error) {
      res.status(404).json({
        error: "Wrong user name!"
      });
    }
  });
}); //handle response for user registration

usersRouter.post("/", function (req, res, next) {
  var _req$body2 = req.body,
      user_name = _req$body2.user_name,
      first_name = _req$body2.first_name,
      last_name = _req$body2.last_name,
      birth_date = _req$body2.birth_date,
      city = _req$body2.city,
      street = _req$body2.street,
      house_number = _req$body2.house_number,
      postal_code = _req$body2.postal_code,
      phone_number = _req$body2.phone_number;

  var password = _bcrypt["default"].hashSync(req.body.password, 10);

  if (!user_name || !first_name || !last_name || !birth_date || !password || !city || !street || !house_number || !postal_code || !phone_number) {
    return res.sendStatus(403);
  }

  var sql = "INSERT INTO users SET ?";
  var values = {
    user_name: user_name,
    first_name: first_name,
    last_name: last_name,
    birth_date: birth_date,
    password: password,
    city: city,
    street: street,
    house_number: house_number,
    postal_code: postal_code,
    phone_number: phone_number
  };

  _connection["default"].query(sql, values, function (error, results, fields) {
    if (error) {
      return res.status(409).json({
        error: 'User name exists!'
      });
    }

    res.status(200).json({
      response: 'Registration complete!',
      results: results
    });
  });
});
var _default = usersRouter;
exports["default"] = _default;