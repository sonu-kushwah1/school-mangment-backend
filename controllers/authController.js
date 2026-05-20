const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");


// REGISTER
exports.register = async (req, res) => {
  try {

    const { fname, email, phone, role, password } = req.body;

    // check existing user
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user
    await db.query(
      "INSERT INTO users (fname, email, phone, role, password) VALUES (?, ?, ?, ?, ?)",
      [fname, email, phone, role, hashedPassword]
    );

    res.status(201).json({
      message: "Register successful",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fname: user.fname,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// PROFILE
exports.profile = async (req, res) => {
  try {

    const [users] = await db.query(
      "SELECT id, fname, email, phone, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(users[0]);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};