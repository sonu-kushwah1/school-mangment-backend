const express = require("express");
const router = express.Router();
const controller = require("../controllers/transportController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

router.get("/", protect, authorize("view"), controller.getTransport);
router.post("/", protect, authorize("create"), controller.createTransport);
router.put("/:id", protect, authorize("update"), controller.updateTransport);
router.delete("/:id", protect, authorize("delete"), controller.deleteTransport);

module.exports = router;