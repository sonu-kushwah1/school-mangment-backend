const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentFeesController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

router.get("/", protect, authorize("view"), controller.getStudentFees);
router.get("/:id", protect, authorize("view"), controller.getStudentFeesById);
router.post("/", protect, authorize("create"), controller.createStudentFees);
router.put("/:id", protect, authorize("update"), controller.updateStudentFees);
router.delete("/:id", protect, authorize("delete"), controller.deleteStudentFees);

module.exports = router;