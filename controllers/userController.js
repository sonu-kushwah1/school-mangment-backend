const db = require("../db");

exports.getUser = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM user");
    res.json(result);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, Email and Phone are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO user (name, email, phone) VALUES (?, ?, ?)",
      [name, email, phone]
    );

    res.status(201).json({
      message: "User created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    await db.query(
      "UPDATE user SET name=?, email=?, phone=? WHERE id=?",
      [name, email, phone, req.params.id]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM user WHERE id=?", [req.params.id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
