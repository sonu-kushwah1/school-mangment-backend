const express = require("express");
const router = express.Router();
const controller = require("../controllers/classController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

router.get("/", protect, authorize("view"), controller.getClasses);
router.get("/:id", protect, authorize("view"), controller.getSingleClass);
router.post("/", protect, authorize("create"), controller.createClasses);
router.put("/:id", protect, authorize("update"), controller.updateClasses);
router.delete("/:id", protect, authorize("delete"), controller.deleteClasses);

module.exports = router;