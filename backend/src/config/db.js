import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ngo_data_hub',
  waitForConnections: true,
  connectionLimit: 10
});
