const db = require("../db");

exports.getTransport = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM transport");
    res.json(result);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createTransport = async (req, res) => {
  try {
    const { routeName, vehicleNo, driverName, licenseNo, phoneNo } = req.body;

    if (!routeName || !vehicleNo || !driverName) {
      return res.status(400).json({
        message: "Route Name, Vehicle Number and Driver Name are required",
      });
    }

    const [result] = await db.query(
      "INSERT INTO transport (routeName, vehicleNo, driverName, licenseNo, phoneNo) VALUES (?, ?, ?, ?, ?)",
      [routeName, vehicleNo, driverName, licenseNo || null, phoneNo || null]
    );

    res.status(201).json({
      message: "Transport created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.log("SQL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransport = async (req, res) => {
  try {
    const { routeName, vehicleNo, driverName, licenseNo, phoneNo } = req.body;

    await db.query(
      "UPDATE transport SET routeName=?, vehicleNo=?, driverName=?, licenseNo=?, phoneNo=? WHERE id=?",
      [routeName, vehicleNo, driverName, licenseNo, phoneNo, req.params.id]
    );

    res.json({ message: "Transport updated successfully" });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransport = async (req, res) => {
  try {
    await db.query("DELETE FROM transport WHERE id=?", [req.params.id]);
    res.json({ message: "Transport deleted successfully" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
