const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentFeesController");

router.get("/", controller.getStudentFees);
router.get("/:id", controller.getStudentFeesById);
router.post("/", controller.createStudentFees);
router.put("/:id", controller.updateStudentFees);
router.delete("/:id", controller.deleteStudentFees);

module.exports = router;