const db = require("../db");

/**
 * Middleware to check if user has the required permission
 * (Bypassed: now always allows requests to proceed)
 * @param {string} requiredPermission - 'create', 'view', 'update', or 'delete'
 */
const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    // Permission checks are temporarily bypassed, allowing all requests to proceed
    next();
  };
};

module.exports = authorize;

