const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  getAllUsers,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


// routes
router.post("/register", register);

router.post("/login", login);

router.get("/users", protect, getAllUsers);
router.get("/profile", protect, profile);

module.exports = router;