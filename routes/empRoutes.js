const express = require("express");
const router = express.Router();
const controller = require("../controllers/empController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

router.get("/", protect, authorize("view"), controller.getEmp);
router.post("/", protect, authorize("create"), controller.createEmp);
router.put("/:id", protect, authorize("update"), controller.updateEmp);
router.delete("/:id", protect, authorize("delete"), controller.deleteEmp);

module.exports = router;