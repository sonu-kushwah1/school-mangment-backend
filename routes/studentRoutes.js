const express = require("express");
const router = express.Router();

const controller = require("../controllers/studentsController");
const upload = require("../middleware/uploadMiddleware");

// GET ALL
router.get("/", controller.getStudent);

// GET SINGLE
router.get("/:id", controller.getStudentById);

// CREATE
router.post("/", upload.single("student_img"), controller.createStudent);

// UPDATE
router.put("/:id", upload.single("student_img"), controller.updateStudent);

// DELETE
router.delete("/:id", controller.deleteStudent);

module.exports = router;