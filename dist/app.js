"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _morgan = _interopRequireDefault(require("morgan"));

var _errorhandler = _interopRequireDefault(require("errorhandler"));

var _api = _interopRequireDefault(require("./api/api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = process.env.PORT || 3001;
app.use(_express["default"].json());
app.use((0, _morgan["default"])('dev'));
app.use((0, _cors["default"])());
app.use((0, _errorhandler["default"])());

function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({
      nope: true
    });
  } else {
    next();
  }
}

app.use(ignoreFavicon);
app.use('/api', _api["default"]);
app.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});