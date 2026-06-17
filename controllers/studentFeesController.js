const db = require("../db");

// Get all student fee records
exports.getStudentFees = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM student_fees");
    res.json(result);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get single student fee record by ID
exports.getStudentFeesById = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM student_fees WHERE id=?", [
      req.params.id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.log("GET SINGLE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new student fee record
exports.createStudentFees = async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      student_class,
      total_fees,
      paid_fees,
      due_fees,
      payment_method,
      date
    } = req.body;

    // Validation
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "student_id is required"
      });
    }

    if (total_fees === undefined || total_fees === null) {
      return res.status(400).json({
        success: false,
        message: "total_fees is required"
      });
    }

    const [result] = await db.query(
      `INSERT INTO student_fees 
      (student_id, student_class, student_name, total_fees, paid_fees, due_fees, payment_method, date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        student_class !== undefined ? student_class : null,
        student_name !== undefined ? student_name : null,
        total_fees,
        paid_fees !== undefined ? paid_fees : 0,
        due_fees !== undefined ? due_fees : 0,
        payment_method !== undefined ? payment_method : null,
        date !== undefined ? date : null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Student fee record created successfully",
      id: result.insertId
    });

  } catch (err) {
    console.log("SQL ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

// Update an existing student fee record
exports.updateStudentFees = async (req, res) => {
  try {
    const {
      student_id,
      student_name,
      student_class,
      total_fees,
      paid_fees,
      due_fees,
      payment_method,
      date
    } = req.body;

    // Validation
    if (!student_id) {
      return res.status(400).json({
        message: "student_id is required"
      });
    }

    if (total_fees === undefined || total_fees === null) {
      return res.status(400).json({
        message: "total_fees is required"
      });
    }

    const [result] = await db.query(
      "UPDATE student_fees SET student_id=?, student_class=?, student_name=?, total_fees=?, paid_fees=?, due_fees=?, payment_method=?, date=? WHERE id=?",
      [
        student_id,
        student_class !== undefined ? student_class : null,
        student_name !== undefined ? student_name : null,
        total_fees,
        paid_fees !== undefined ? paid_fees : 0,
        due_fees !== undefined ? due_fees : 0,
        payment_method !== undefined ? payment_method : null,
        date !== undefined ? date : null,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    res.json({ message: "Student fee record updated successfully" });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a student fee record
exports.deleteStudentFees = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM student_fees WHERE id=?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student fee record not found" });
    }

    res.json({ message: "Student fee record deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
