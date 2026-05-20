const express = require("express");
const router = express.Router();

const controller = require("../controllers/feesController");

// GET ALL
router.get("/", controller.getFees);

// GET SINGLE
router.get("/:id", controller.getSingleFees);

// CREATE
router.post("/", controller.createFees);

// UPDATE
router.put("/:id", controller.updateFees);

// DELETE
router.delete("/:id", controller.deleteFees);

module.exports = router;