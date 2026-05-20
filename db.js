const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "student_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
(async () => {
  try {

    const connection = await db.getConnection();

    console.log("✅ MySQL Connected");

    connection.release();

  } catch (error) {

    console.error("❌ MySQL Connection Failed");
    console.error(error);

  }
})();

module.exports = db;