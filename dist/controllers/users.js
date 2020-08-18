"use strict";

require("core-js/modules/es.array.find");

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Controller get users list 
exports.getUserList = function (req, res, next) {
  console.log(_users["default"]);

  _users["default"].find({}, {}, function (err, users) {
    if (err || !users) {
      res.status(401).send({
        message: "Unauthorized"
      });
      next(err);
    } else {
      res.json({
        status: "success",
        users: users
      });
    }
  });
};