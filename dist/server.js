"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _routes = _interopRequireDefault(require("./routes"));

var _config = _interopRequireDefault(require("../config"));

var _userSeeder = require("./seed/user-seeder");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Initialize app 
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.get('/', function (req, res) {
  res.json({
    app: 'Run app auth'
  });
}); // Connect to MongoDB 

_mongoose["default"].connect(_config["default"].URI_MONGO, {
  useCreateIndex: true,
  useNewUrlParser: true
})["catch"](function (err) {
  return console.log('Error: Could not connect to MongoDB!!!.', err);
});

_mongoose["default"].connection.on('connected', function () {
  (0, _userSeeder.initializeData)();
  console.log('Initialize user');
});

_mongoose["default"].connection.on('error', function (err) {
  console.log('Error: Could not connect to MongoDB.', err);
}); // Routes app 


app.use('/', _routes["default"]); // Start app 

app.listen(_config["default"].PORT_LISTEN, function () {
  console.log('Listen port ' + _config["default"].PORT_LISTEN);
});