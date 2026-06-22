const express = require("express");
const router = express.Router();

const controller = require("../controllers/studentsController");
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

// GET ALL
router.get("/", protect, authorize("view"), controller.getStudent);

// GET SINGLE
router.get("/:id", protect, authorize("view"), controller.getStudentById);

// CREATE
router.post("/", protect, authorize("create"), upload.single("student_img"), controller.createStudent);

// UPDATE
router.put("/:id", protect, authorize("update"), upload.single("student_img"), controller.updateStudent);

// DELETE
router.delete("/:id", protect, authorize("delete"), controller.deleteStudent);

module.exports = router;