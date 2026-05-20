const db = require("../db");

exports.getStudentFees = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM student_fees");
    res.json(result);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createStudentFees = async (req, res) => {
  try {
    const { student_class, student_name, total_Fees,paid_fees,fees_amount,date,pay_method } = req.body;

    if (!student_class || !student_name || !total_Fees) {
      return res.status(400).json({
        message: "Student class, name and total fees are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO student_fees (student_class, student_name, total_Fees, paid_fees, fees_amount, date, pay_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [student_class, student_name, total_Fees, paid_fees, fees_amount, date, pay_method]
    );

    res.status(201).json({
      message: "Student fee record created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudentFees = async (req, res) => {
  try {
    const { student_class, student_name, total_Fees, paid_fees, fees_amount, date, pay_method } = req.body;

    await db.query(
      "UPDATE student_fees SET student_class=?, student_name=?, total_Fees=?, paid_fees=?, fees_amount=?, date=?, pay_method=? WHERE id=?",
      [student_class, student_name, total_Fees, paid_fees, fees_amount, date, pay_method, req.params.id]
    );

    res.json({ message: "Student fee record updated successfully" });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudentFees = async (req, res) => {
  try {
    await db.query("DELETE FROM student_fees WHERE id=?", [req.params.id]);
    res.json({ message: "Student fee record deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
