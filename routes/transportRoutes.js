const express = require("express");
const router = express.Router();
const controller = require("../controllers/transportController");

router.get("/", controller.getTransport);
router.post("/", controller.createTransport);
router.put("/:id", controller.updateTransport);
router.delete("/:id", controller.deleteTransport);

module.exports = router;