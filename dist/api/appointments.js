"use strict";

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connection = _interopRequireDefault(require("../helpers/connection"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var appointmentsRouter = _express["default"].Router({
  mergeParams: true
}); //return user appointments


appointmentsRouter.get("/", function (req, res, next) {
  var userId = req.params.userId;

  _connection["default"].query("SELECT timeslots.timeslot_start, timeslots.timeslot_end, doctors.first_name, doctors.last_name, days_of_work.appointment_duration, days_of_work.date\n    FROM appointments\n    INNER JOIN timeslots ON appointments.timeslots_id = timeslots.id\n    INNER JOIN days_of_work ON timeslots.days_of_work_id = days_of_work.id\n    INNER JOIN doctors ON days_of_work.doctor_id = doctors.id\n    INNER JOIN users ON appointments.user_id = users.id\n    WHERE appointments.user_id = ".concat(userId), function (error, appointments, fields) {
    if (error) {
      next(error);
    } else {
      res.status(200).json({
        appointments: appointments
      });
    }
  });
}); //post user appointment

appointmentsRouter.post("/", function (req, res, next) {
  var _req$body = req.body,
      date = _req$body.date,
      timeslot_start = _req$body.timeslot_start,
      timeslot_end = _req$body.timeslot_end,
      is_available = _req$body.is_available,
      doctor_id = _req$body.doctor_id;
  var userId = req.params.userId;

  if (!date || !timeslot_start || !timeslot_end || !is_available || !doctor_id || !userId) {
    return res.sendStatus(403);
  } //?transaction in future?
  //get day of 'to be created' appointment from days_of_work table by date & doctor id


  _connection["default"].query("SELECT * FROM days_of_work WHERE days_of_work.date = '".concat(date, "' AND days_of_work.doctor_id = ").concat(doctor_id), function (error, day) {
    if (error) {
      next(error);
    } else if (day.length !== 0) {
      var days_of_work_id = day[0].id;
      var sql = "INSERT INTO timeslots SET ?";
      var values = {
        days_of_work_id: days_of_work_id,
        timeslot_start: timeslot_start,
        timeslot_end: timeslot_end,
        is_available: is_available
      }; //?find a way to restructure it. operations on timeslots table in appointment router?//
      //insert timeslot related to the selected day 

      _connection["default"].query(sql, values, function (error, results, fields) {
        if (error) {
          next(error);
        }

        var timeslots_id = results.insertId;
        var sql = "INSERT INTO appointments SET ?";
        var values = {
          user_id: userId,
          timeslots_id: timeslots_id
        }; //insert appointment related to user and created timeslot

        _connection["default"].query(sql, values, function (error, results, fields) {
          if (error) {
            next(error);
          }

          res.status(200).json({
            response: "Appointment has been Booked!"
          });
        });
      });
    } else {
      res.sendStatus(404);
    }
  });
});
var _default = appointmentsRouter;
exports["default"] = _default;