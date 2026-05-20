const db = require("../db");

// GET ALL
exports.getEmp = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM emp");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createEmp = async (req, res) => {
  try {
    const { name, email, course, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email required" });
    }
    const [result] = await db.query(
      "INSERT INTO emp (name, email, course, age) VALUES (?, ?, ?, ?)",
      [name, email, course || null, age || null]
    );
    res.json({ message: "Student added successfully", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateEmp = async (req, res) => {
  try {
    const { name, email, course, age } = req.body;
    await db.query(
      "UPDATE emp SET name=?, email=?, course=?, age=? WHERE id=?",
      [name, email, course, age, req.params.id]
    );
    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteEmp = async (req, res) => {
  try {
    await db.query("DELETE FROM emp WHERE id=?", [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};