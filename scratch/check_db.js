const db = require("../db");

(async () => {
  try {
    const [result] = await db.query("DESCRIBE users");
    console.log("Users Table Structure:");
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error("Error executing query:", err);
    process.exit(1);
  }
})();
