const db = require("../db");

/**
 * Middleware to check if user has the required permission
 * @param {string} requiredPermission - 'create', 'view', 'update', or 'delete'
 */
const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Check if user is authenticated and has a role
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Access denied. No role found for user.",
        });
      }

      const userRole = req.user.role;

      // 2. Query role_permissions table to see if role has requiredPermission
      const [rows] = await db.query(
        "SELECT * FROM role_permissions WHERE role = ? AND permission = ?",
        [userRole, requiredPermission]
      );

      // 3. If no matching permission row is found, deny access
      if (rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Role '${userRole}' does not have '${requiredPermission}' permission.`,
        });
      }

      // 4. Otherwise, proceed
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error during authorization.",
        error: error.message,
      });
    }
  };
};

module.exports = authorize;


