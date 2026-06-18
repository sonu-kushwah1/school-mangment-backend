const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");


// REGISTER
exports.register = async (req, res) => {
  try {

    const { fname, email, phone, role, password } = req.body;

    if (!fname || !email || !phone || !role || !password) {
      return res.status(400).json({
        message: "fname, email, phone, role and password are required",
      });
    }

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

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

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



// GET ALL AUTH USERS (users table — register/login wale)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, fname, email, phone, role FROM users"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
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


// UPDATE PROFILE (Self)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fname, email, phone, password } = req.body;

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Check email uniqueness if email is changing
    if (email && email !== user.email) {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedFname = fname !== undefined ? fname : user.fname;
    const updatedEmail = email !== undefined ? email : user.email;
    const updatedPhone = phone !== undefined ? phone : user.phone;
    let updatedPassword = user.password;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    await db.query(
      "UPDATE users SET fname = ?, email = ?, phone = ?, password = ? WHERE id = ?",
      [updatedFname, updatedEmail, updatedPhone, updatedPassword, userId]
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: userId,
        fname: updatedFname,
        email: updatedEmail,
        phone: updatedPhone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE USER BY ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fname, email, phone, role, password } = req.body;

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Check email uniqueness if email is changing
    if (email && email !== user.email) {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedFname = fname !== undefined ? fname : user.fname;
    const updatedEmail = email !== undefined ? email : user.email;
    const updatedPhone = phone !== undefined ? phone : user.phone;
    const updatedRole = role !== undefined ? role : user.role;
    let updatedPassword = user.password;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(password, salt);
    }

    await db.query(
      "UPDATE users SET fname = ?, email = ?, phone = ?, role = ?, password = ? WHERE id = ?",
      [updatedFname, updatedEmail, updatedPhone, updatedRole, updatedPassword, id]
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: parseInt(id),
        fname: updatedFname,
        email: updatedEmail,
        phone: updatedPhone,
        role: updatedRole,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};