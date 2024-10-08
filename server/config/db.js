const mysql = require ('mysql2');
const dotenv = require ('dotenv');
dotenv.config();
const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database_name,
}).promise();

module.exports = pool;