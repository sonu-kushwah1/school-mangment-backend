const db = require("../db");
const fs = require("fs");
const path = require("path");

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

    const student_img = req.file ? req.file.filename : (req.body.student_img || null);

    const sql = `
      INSERT INTO student
      (first_name, last_name, gender, mob_no, dob, blood_group, religion, class_name, email, section, fees, student_img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      student_img,
    ]);

    res.status(201).json({
      message: "Student created",
      id: result.insertId,
    });
  } catch (err) {
    console.log(err);
    // Cleanup uploaded file if DB insert failed
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
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

    // Get current student details to get existing image
    const [students] = await db.query("SELECT student_img FROM student WHERE id = ?", [req.params.id]);
    if (students.length === 0) {
      // Cleanup uploaded file if student not found
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: "Student not found" });
    }

    const oldImg = students[0].student_img;
    let newImg = oldImg;

    if (req.file) {
      newImg = req.file.filename;
      // Delete old image file if it exists
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    } else if (req.body.student_img === null || req.body.student_img === "null") {
      newImg = null;
      if (oldImg) {
        const oldFilePath = path.join(__dirname, "../uploads", oldImg);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    await db.query(
      "UPDATE student SET first_name=?, last_name=?, gender=?, mob_no=?, dob=?, blood_group=?, religion=?, class_name=?, email=?, section=?, fees=?, student_img=? WHERE id=?",
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
        newImg,
        req.params.id,
      ]
    );

    res.json({ message: "Student updated" });
  } catch (err) {
    // Cleanup uploaded file if update failed
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    // Get student to delete their image first
    const [students] = await db.query("SELECT student_img FROM student WHERE id = ?", [req.params.id]);
    if (students.length > 0 && students[0].student_img) {
      const filePath = path.join(__dirname, "../uploads", students[0].student_img);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM student WHERE id=?", [req.params.id]);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
