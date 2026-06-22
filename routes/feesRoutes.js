const express = require("express");
const router = express.Router();

const controller = require("../controllers/feesController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/permissionMiddleware");

// GET ALL
router.get("/", protect, authorize("view"), controller.getFees);

// GET SINGLE
router.get("/:id", protect, authorize("view"), controller.getSingleFees);

// CREATE
router.post("/", protect, authorize("create"), controller.createFees);

// UPDATE
router.put("/:id", protect, authorize("update"), controller.updateFees);

// DELETE
router.delete("/:id", protect, authorize("delete"), controller.deleteFees);

module.exports = router;