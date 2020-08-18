"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _connection = _interopRequireDefault(require("../helpers/connection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var timeslotsRouter = express.Router({
  mergeParams: true
}); //return all timeslots appointed at param day

timeslotsRouter.get("/", function (req, res, next) {
  _connection["default"].query("SELECT * FROM timeslots WHERE timeslots.days_of_work_id= '".concat(req.day[0].id, "' "), function (error, timeslots, fields) {
    if (error) {
      next(error);
    }

    res.status(200).json({
      timeslots: timeslots
    });
  });
}); //post booked timeslot

timeslotsRouter.post("/", function (req, res, next) {
  var _req$body = req.body,
      timeslot_start = _req$body.timeslot_start,
      timeslot_end = _req$body.timeslot_end,
      is_available = _req$body.is_available;
  var days_of_work_id = req.day[0].id;

  if (!days_of_work_id || !timeslot_start || !timeslot_end || !is_available) {
    return res.sendStatus(403);
  }

  var sql = "INSERT INTO timeslots SET";
  var values = {
    days_of_work_id: days_of_work_id,
    timeslot_start: timeslot_start,
    timeslot_end: timeslot_end,
    is_available: is_available
  };

  _connection["default"].query(sql, values, function (error, results, fields) {
    if (error) {
      next(error);
    }

    res.status(200).json({
      response: "Appointment has been Booked!"
    });
  });
});
var _default = timeslotsRouter;
exports["default"] = _default;