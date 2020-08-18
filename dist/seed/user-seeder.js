"use strict";

require("core-js/modules/es.array.find");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeData = void 0;

require("regenerator-runtime/runtime");

var _users = _interopRequireDefault(require("../models/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function isUsersExist() {
  return _isUsersExist.apply(this, arguments);
} // Initialize first user 


function _isUsersExist() {
  _isUsersExist = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var exec;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _users["default"].find().exec();

          case 2:
            exec = _context2.sent;
            return _context2.abrupt("return", exec.length || 0);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _isUsersExist.apply(this, arguments);
}

var initializeData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return isUsersExist();

          case 2:
            if (_context.sent) {
              _context.next = 4;
              break;
            }

            (function () {
              var user = [new _users["default"]({
                role: "ADMIN",
                name: "admin",
                email: "admin@admin.com",
                password: "admin"
              })];
              var done = 0;

              for (var i = 0; i < user.length; i++) {
                user[i].save(function (err, result) {
                  done++;
                });
              }
            })();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initializeData() {
    return _ref.apply(this, arguments);
  };
}();

exports.initializeData = initializeData;