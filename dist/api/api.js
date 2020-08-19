"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("./users"));

var _doctors = _interopRequireDefault(require("./doctors"));

var _news = _interopRequireDefault(require("./news"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRouter = _express["default"].Router();

apiRouter.use('/users', _users["default"]);
apiRouter.use('/doctors', _doctors["default"]);
apiRouter.use('/news', _news["default"]);
var _default = apiRouter;
exports["default"] = _default;