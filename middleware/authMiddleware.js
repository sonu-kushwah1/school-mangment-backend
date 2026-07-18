const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token",
    });
  }

  try {
    // Support both "Bearer <token>" and direct "<token>" formats
    let token = authHeader;
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "school_management_secret_key"
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = protect;