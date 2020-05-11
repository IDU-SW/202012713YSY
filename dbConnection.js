const mysql = require('mysql2');

const dbConfig = {
   host: 'localhost',
   user: 'dev',
   password: '4448',
   port: 3306,
   database: 'example',
   connectionLimit: 5,
   waitForConnections: true
};

const pool = mysql.createConnection(dbConfig);
module.exports = pool;