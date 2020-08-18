"use strict";

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _connection = _interopRequireDefault(require("../helpers/connection"));

var _timeslots = _interopRequireDefault(require("./timeslots"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var daysOfWorkRouter = express.Router({
  mergeParams: true
});
daysOfWorkRouter.use('/:date/timeslots', _timeslots["default"]); //callback for route parameter which attaches day selected by date and doctor id from days_of_work table to request object

daysOfWorkRouter.param('date', function (req, res, next, date) {
  var doctorId = req.params.doctorId;

  _connection["default"].query("SELECT * FROM days_of_work WHERE days_of_work.date = '".concat(date, "' AND days_of_work.doctor_id = ").concat(doctorId, " LIMIT 1"), function (error, day) {
    if (error) {
      res.status(500).json(error);
    } else if (day.length !== 0) {
      req.day = day;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); //return single day

daysOfWorkRouter.get('/:date', function (req, res, next) {
  res.status(200).json({
    day: req.day[0]
  });
});
var _default = daysOfWorkRouter;
exports["default"] = _default;