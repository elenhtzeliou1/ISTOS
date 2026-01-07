const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

/**
 * Removes sensitive fields and returns only safe user data.
 * Used in API responses so we never expose password hashes.
 */
const sanitizeUser = (u) => ({
  _id: u._id,
  firstName: u.firstName,
  lastName: u.lastName,
  userName: u.userName,
  email: u.email,
  dob: u.dob,
  interest: u.interest,
  level: u.level,
  goal: u.goal,
  newsletter: u.newsletter,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

/**
 * POST /api/auth/login
 * Authenticates user credentials and returns:
 * - JWT token
 * - sanitized user object
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

   /**
     * passwordHash is defined with select:false in the User schema,
     * so we must explicitly select it here.
     */
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+passwordHash");
    
    // Avoid leaking whether email exists or not
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

     // Compare plaintext password with stored hash
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    // Create JWT token (subject = userId)
    const token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    return next(err);
  }
};

