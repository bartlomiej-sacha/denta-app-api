"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mysql = _interopRequireDefault(require("mysql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config(); //pool created for managing connections to remote database, if you cloned this rep its mandatory to create .env file and provide database option variables


var pool = _mysql["default"].createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB
});

var _default = pool;
exports["default"] = _default;