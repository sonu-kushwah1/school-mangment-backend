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


//Routs User
const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

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

//user table
db.query("DESCRIBE user")
  .then(([result]) => console.log("📊 TABLE STRUCTURE:", result))
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

