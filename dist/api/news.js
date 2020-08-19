"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _connection = _interopRequireDefault(require("../helpers/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var newsRouter = express.Router();
newsRouter.get("/", function (req, res, next) {
  _connection["default"].query('SELECT * FROM news', function (error, news, fields) {
    if (error) {
      next(error);
    }

    res.status(200).json({
      news: news
    });
  });
});
var _default = newsRouter;
exports["default"] = _default;