const express = require("express");
const router = express.Router();
const controller = require("../controllers/empController");

router.get("/", controller.getEmp);
router.post("/", controller.createEmp);
router.put("/:id", controller.updateEmp);
router.delete("/:id", controller.deleteEmp);

module.exports = router;