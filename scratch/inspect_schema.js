const db = require("../db");

(async () => {
  try {
    const [tables] = await db.query("SHOW TABLES");
    console.log("Database Tables:", tables.map(t => Object.values(t)[0]));

    const [desc] = await db.query("DESCRIBE role_permissions");
    console.log("\nrole_permissions Table Structure:");
    console.log(desc);

    const [rows] = await db.query("SELECT * FROM role_permissions");
    console.log("\nrole_permissions Rows:");
    console.log(rows);

    process.exit(0);
  } catch (err) {
    console.error("Error inspecting database schema:", err);
    process.exit(1);
  }
})();
