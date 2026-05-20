const db = require("../db");

exports.getFees = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM fees");
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSingleFees = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM fees WHERE id=?", [
      req.params.id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    res.status(200).json({ success: true, data: result[0] });
  } catch (err) {
    console.log("GET SINGLE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createFees = async (req, res) => {
  try {
    const { className, fees } = req.body;

    if (!className || fees === undefined || fees === null) {
      return res.status(400).json({
        success: false,
        message: "Class Name and Fees are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO fees (className, fees) VALUES (?, ?)",
      [className, fees]
    );

    res.status(201).json({
      success: true,
      message: "Fee added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log("INSERT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateFees = async (req, res) => {
  try {
    const { className, fees } = req.body;

    if (!className || fees === undefined || fees === null) {
      return res.status(400).json({
        success: false,
        message: "Class Name and Fees are required",
      });
    }

    await db.query("UPDATE fees SET className=?, fees=? WHERE id=?", [
      className,
      fees,
      req.params.id,
    ]);

    res.status(200).json({
      success: true,
      message: "Fee updated successfully",
    });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteFees = async (req, res) => {
  try {
    await db.query("DELETE FROM fees WHERE id=?", [req.params.id]);
    res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
