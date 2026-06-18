const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  getAllUsers,
  updateProfile,
  updateUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");


// routes
router.post("/register", register);

router.post("/login", login);

router.get("/users", protect, getAllUsers);
router.get("/profile", protect, profile);

router.put("/profile", protect, updateProfile);
router.put("/user/:id", protect, updateUser);

module.exports = router;