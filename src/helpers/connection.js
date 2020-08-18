import mysql from 'mysql'
require('dotenv').config();

//pool created for managing connections to remote database, if you cloned this rep its mandatory to create .env file and provide database option variables
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

export default pool;
