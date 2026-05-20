const express = require("express");
const router = express.Router();

const controller = require("../controllers/studentsController");

// GET ALL
router.get("/", controller.getStudent);

// GET SINGLE
router.get("/:id", controller.getStudentById);

// CREATE
router.post("/", controller.createStudent);

// UPDATE
router.put("/:id", controller.updateStudent);

// DELETE
router.delete("/:id", controller.deleteStudent);

module.exports = router;