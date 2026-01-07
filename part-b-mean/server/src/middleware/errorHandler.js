/**
 * Global error-handling middleware for Express.
 * Must be registered AFTER all routes/middlewares.
 *
 * Usage:
 *   app.use(errorHandler)
 *
 * Notes:
 * - Logs the full stack trace to the server console for debugging.
 * - Returns a generic 500 response to avoid leaking internal details.
 */

module.exports = (err, req, res, next) => {
  console.error(err.stack);

    // Generic response for unexpected server errors
  res.status(500).json({ message: "Server error" });
};
