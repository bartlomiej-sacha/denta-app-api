"use strict";

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("./controllers/auth"));

var _users = _interopRequireDefault(require("./controllers/users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/login', _auth["default"].loginUser);
router.post('/refresh', _auth["default"].refreshTokenVerify); // secure router 

router.get('/users', _auth["default"].accessTokenVerify, _users["default"].getUserList);
router.post('/register', _auth["default"].accessTokenVerify, _auth["default"].createUser);
module.exports = router;