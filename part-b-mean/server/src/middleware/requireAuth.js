const jwt = require("jsonwebtoken");

/**
 * JWT authentication middleware.
 *
 * Purpose:
 * - Protects routes that require a logged-in user.
 * - Expects an Authorization header in the form:
 *     Authorization: Bearer <token>
 *
 * Behavior:
 * - If the token is valid, the decoded user id is stored on:
 *     req.userId
 * - If missing or invalid, returns 401 Unauthorized.
 */

module.exports = function requireAuth(req, res, next) {
  try {
    // Read Authorization header (if provided)
    const h = req.headers.authorization || "";

    // Extract token only if it starts with "Bearer "
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;

    // Reject if token is missing
    if (!token) return res.status(401).json({ message: "Missing token." });

    // Verify JWT signature and expiration
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Store authenticated user's id on the request object
    // Convention: user id stored in JWT subject (sub)
    req.userId = payload.sub;
    next();
  } catch {
    // Token invalid or expired
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
