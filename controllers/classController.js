const db = require("../db");

exports.getClasses = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM classname");
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSingleClass = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM classname WHERE id=?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    console.log("GET SINGLE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createClasses = async (req, res) => {
  try {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({
        success: false,
        message: "Class Name is required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO classname (className) VALUES (?)",
      [className]
    );

    res.status(201).json({
      success: true,
      message: "Class added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log("INSERT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateClasses = async (req, res) => {
  try {
    const { className } = req.body;

    if (!className) {
      return res.status(400).json({
        success: false,
        message: "Class Name is required",
      });
    }

    await db.query("UPDATE classname SET className=? WHERE id=?", [
      className,
      req.params.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
    });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteClasses = async (req, res) => {
  try {
    await db.query("DELETE FROM classname WHERE id=?", [req.params.id]);
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
