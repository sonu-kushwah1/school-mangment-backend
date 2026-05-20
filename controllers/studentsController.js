const db = require("../db");

exports.getStudent = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM student");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM student WHERE id=?", [
      req.params.id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      gender,
      mob_no,
      dob,
      blood_group,
      religion,
      class_name,
      email,
      section,
      fees,
    } = req.body;

    fees = fees ?? 0;

    if (!first_name || !email) {
      return res.status(400).json({
        message: "First name and email required",
      });
    }

    const sql = `
      INSERT INTO student
      (first_name, last_name, gender, mob_no, dob, blood_group, religion, class_name, email, section, fees)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      first_name,
      last_name,
      gender,
      mob_no,
      dob,
      blood_group,
      religion,
      class_name,
      email,
      section,
      fees,
    ]);

    res.status(201).json({
      message: "Student created",
      id: result.insertId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      mob_no,
      dob,
      blood_group,
      religion,
      class_name,
      email,
      section,
      fees,
    } = req.body;

    await db.query(
      "UPDATE student SET first_name=?, last_name=?, gender=?, mob_no=?, dob=?, blood_group=?, religion=?, class_name=?, email=?, section=?, fees=? WHERE id=?",
      [
        first_name,
        last_name,
        gender,
        mob_no,
        dob,
        blood_group,
        religion,
        class_name,
        email,
        section,
        fees,
        req.params.id,
      ]
    );

    res.json({ message: "Student updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await db.query("DELETE FROM student WHERE id=?", [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
