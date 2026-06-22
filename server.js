const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ IMPORTANT MIDDLEWARES
app.use(cors());
app.use(express.json()); // 🔥 THIS FIXES YOUR ISSUE
app.use("/uploads", express.static(uploadsDir));

// Routes Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Routes emp
const empRoutes = require("./routes/empRoutes");
app.use("/api/emp", empRoutes);

//Routs Students
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);

//Routs Students Fees
const studentFeesRoutes = require("./routes/studentFeesRoutes");
app.use("/api/studentfees", studentFeesRoutes);




//Routs Class
const classRoutes = require("./routes/classRoutes");
app.use("/api/class", classRoutes);

//Routs Fees
const feesRoutes = require("./routes/feesRoutes");
app.use("/api/fees", feesRoutes);

//Routs Transport
const transportRoutes = require("./routes/transportRoutes");
app.use("/api/transport", transportRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("🔐 Auth: POST /api/auth/register | POST /api/auth/login | GET /api/auth/users | GET /api/auth/profile");
});


const db = require("./db");

// 🔍 DEBUG
db.query("SELECT DATABASE() as db")
  .then(([result]) => console.log("📌 CURRENT DB:", result))
  .catch(err => console.log(err));

db.query("DESCRIBE emp")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

//students table
db.query("DESCRIBE student")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

// Ensure user_profile column exists in users table
db.query("ALTER TABLE users ADD COLUMN user_profile VARCHAR(255) DEFAULT NULL")
  .then(() => console.log("✅ Column user_profile verified/added to users table"))
  .catch(err => {
    // Ignore duplicate column name error (ER_DUP_FIELDNAME)
    if (err.errno === 1060 || err.code === 'ER_DUP_FIELDNAME') {
      console.log("ℹ️ Column user_profile already exists in users table");
    } else {
      console.error("❌ Error adding user_profile column:", err.message);
    }
  })
  .then(() => {
    // Ensure the column explicitly allows NULL (in case it was created as NOT NULL previously)
    return db.query("ALTER TABLE users MODIFY COLUMN user_profile VARCHAR(255) NULL DEFAULT NULL");
  })
  .then(() => console.log("✅ Column user_profile modified to allow NULL values"))
  .catch(err => console.error("❌ Error modifying user_profile column:", err.message))
  .then(() => {
    //user table
    return db.query("DESCRIBE users");
  })

  .then(([result]) => console.log("📊 TABLE STRUCTURE (users):", result))
  .catch(err => console.log(err));

//classname table
db.query("DESCRIBE classname")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

//fees table
db.query("DESCRIBE fees")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

//transport table
db.query("DESCRIBE transport")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

//Student Fees table
db.query("DESCRIBE student_fees")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
  .catch(err => console.log(err));

// Initialize default role permissions if empty
db.query("SELECT COUNT(*) as count FROM role_permissions")
  .then(([rows]) => {
    if (rows[0].count === 0) {
      console.log("ℹ️ role_permissions table is empty. Initializing default permissions...");
      const defaults = [
        ["admin", "create"],
        ["admin", "view"],
        ["admin", "update"],
        ["admin", "delete"],
        ["teacher", "create"],
        ["teacher", "view"],
        ["teacher", "update"],
        ["student", "view"]
      ];
      return db.query("INSERT INTO role_permissions (role, permission) VALUES ?", [defaults]);
    }
  })
  .then(() => console.log("✅ Initialized default role_permissions successfully"))
  .catch(err => console.error("❌ Error initializing role_permissions:", err.message));


