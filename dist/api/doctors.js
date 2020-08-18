"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connection = _interopRequireDefault(require("../helpers/connection"));

var _daysOfWork = _interopRequireDefault(require("./daysOfWork"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var doctorsRouter = _express["default"].Router();

doctorsRouter.use('/:doctorId/days-Of-work', function (req, res, next) {
  req.doctorId = req.params.doctorId;
  next();
}, _daysOfWork["default"]); //callback for route parameter which attaches doctor returned from database to request object

doctorsRouter.param('doctorId', function (req, res, next, doctorId) {
  _connection["default"].query("SELECT * FROM doctors WHERE doctors.id = '".concat(doctorId, "'"), function (error, doctor) {
    if (error) {
      next(error);
    } else if (doctor) {
      req.doctor = doctor;
      next();
    } else {
      res.sendStatus(404);
    }
  });
}); //return single doctor by id

doctorsRouter.get('/:doctorId', function (req, res, next) {
  res.status(200).json(req.doctor);
}); //return all doctors

doctorsRouter.get("/", function (req, res, next) {
  _connection["default"].query('SELECT * FROM doctors', function (error, doctors, fields) {
    if (error) {
      next(error);
    }

    res.status(200).json({
      doctors: doctors
    });
  });
});
var _default = doctorsRouter;
exports["default"] = _default;