const express = require("express");

const router = express.Router();

const {
  register,
  login,
  profile,
  getAllUsers,
  updateProfile,
  updateUser,
  deleteUser,
  getRolePermissions,
  updateRolePermissions,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/userUploadMiddleware");
const authorize = require("../middleware/permissionMiddleware");

// routes
router.post("/register", upload.single("user_profile"), register);

router.post("/login", login);

router.get("/users", protect, getAllUsers);
router.get("/profile", protect, profile);

router.put("/profile", protect, upload.single("user_profile"), updateProfile);
router.put("/user/:id", protect, upload.single("user_profile"), updateUser);
router.delete("/user/:id", protect, deleteUser);

// role permissions endpoints
router.get("/role-permissions", protect, getRolePermissions);
router.post("/role-permissions", protect, authorize("delete"), updateRolePermissions);

module.exports = router;