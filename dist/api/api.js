"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _users = _interopRequireDefault(require("./users"));

var _doctors = _interopRequireDefault(require("./doctors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRouter = _express["default"].Router();

apiRouter.use('/users', _users["default"]);
apiRouter.use('/doctors', _doctors["default"]);
var _default = apiRouter;
exports["default"] = _default;