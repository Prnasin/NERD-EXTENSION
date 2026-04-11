import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("db connection succesful");
    connection.release();
  } catch (error) {
    console.log("error in db");
    throw error;
  }
};

export { pool, checkConnection };
