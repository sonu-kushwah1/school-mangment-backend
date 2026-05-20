const express = require("express");
const router = express.Router();
const controller = require("../controllers/classController");

router.get("/", controller.getClasses);
router.get("/:id", controller.getSingleClass);
router.post("/", controller.createClasses);
router.put("/:id", controller.updateClasses);
router.delete("/:id", controller.deleteClasses);

module.exports = router;