const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const fs = require("fs");
const path = require("path");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { fname, email, phone, role, password } = req.body;

    if (!fname || !email || !phone || !role || !password) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
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
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user_profile = req.file ? req.file.filename : null;

    // insert user
    await db.query(
      "INSERT INTO users (fname, email, phone, role, password, user_profile) VALUES (?, ?, ?, ?, ?, ?)",
      [fname, email, phone, role, hashedPassword, user_profile]
    );

    res.status(201).json({
      message: "Register successful",
    });

  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
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
        role: user.role,
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
        user_profile: user.user_profile,
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
      "SELECT id, fname, email, phone, role, user_profile FROM users"
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
      "SELECT id, fname, email, phone, role, user_profile FROM users WHERE id = ?",
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
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Check email uniqueness if email is changing
    if (email && email !== user.email) {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        if (req.file) {
          const filePath = path.join(__dirname, "../uploads", req.file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
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

    const oldImg = user.user_profile;
    let updatedUserProfile = oldImg;

    if (req.file) {
      updatedUserProfile = req.file.filename;
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else if (req.body.user_profile === null || req.body.user_profile === "null") {
      updatedUserProfile = null;
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.query(
      "UPDATE users SET fname = ?, email = ?, phone = ?, password = ?, user_profile = ? WHERE id = ?",
      [updatedFname, updatedEmail, updatedPhone, updatedPassword, updatedUserProfile, userId]
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: userId,
        fname: updatedFname,
        email: updatedEmail,
        phone: updatedPhone,
        role: user.role,
        user_profile: updatedUserProfile,
      },
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
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
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Check email uniqueness if email is changing
    if (email && email !== user.email) {
      const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUser.length > 0) {
        if (req.file) {
          const filePath = path.join(__dirname, "../uploads", req.file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
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

    const oldImg = user.user_profile;
    let updatedUserProfile = oldImg;

    if (req.file) {
      updatedUserProfile = req.file.filename;
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else if (req.body.user_profile === null || req.body.user_profile === "null") {
      updatedUserProfile = null;
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.query(
      "UPDATE users SET fname = ?, email = ?, phone = ?, role = ?, password = ?, user_profile = ? WHERE id = ?",
      [updatedFname, updatedEmail, updatedPhone, updatedRole, updatedPassword, updatedUserProfile, id]
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: parseInt(id),
        fname: updatedFname,
        email: updatedEmail,
        phone: updatedPhone,
        role: updatedRole,
        user_profile: updatedUserProfile,
      },
    });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER BY ID
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    if (user.user_profile) {
      const filePath = path.join(__dirname, "../uploads", user.user_profile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ROLE PERMISSIONS
exports.getRolePermissions = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM role_permissions");
    // Group permissions by role
    const roleMap = {
      admin: [],
      teacher: [],
      student: []
    };
    rows.forEach(row => {
      if (!roleMap[row.role]) {
        roleMap[row.role] = [];
      }
      roleMap[row.role].push(row.permission);
    });
    res.status(200).json({
      success: true,
      data: roleMap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE ROLE PERMISSIONS
exports.updateRolePermissions = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    if (!role || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "role and permissions array are required"
      });
    }

    // Start database connection from pool for transaction
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Delete existing permissions for this role
      await conn.query("DELETE FROM role_permissions WHERE role = ?", [role]);

      // Insert new permissions if there are any
      if (permissions.length > 0) {
        const values = permissions.map(p => [role, p]);
        await conn.query("INSERT INTO role_permissions (role, permission) VALUES ?", [values]);
      }

      await conn.commit();
      res.status(200).json({
        success: true,
        message: `Permissions updated successfully for role ${role}`
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};