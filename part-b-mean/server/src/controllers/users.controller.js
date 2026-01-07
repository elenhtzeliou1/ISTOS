const bcrypt = require("bcryptjs");
const User = require('../models/user');

/**
 * GET /api/users/me (protected)
 * Returns the logged-in user's profile.
 */
exports.getMe = async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

/**
 * PUT /api/users/me (protected)
 * Updates the logged-in user's profile.
 * Only fields in the allowlist can be changed.
 */
exports.updateMe = async (req, res) => {
    const allowed = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "dob",
        "interest",
        "level",
        "goal",
        "newsletter",
    ];

    
  // Build patch object only with allowed keys
    const patch = {};
    for (const k of allowed) {
        if (req.body[k] !== undefined) patch[k] = req.body[k];
    }

    
  // Update and return updated user (excluding passwordHash)
    const user = await User.findByIdAndUpdate(req.userId, patch, {
        new: true,
        runValidators: true,
        context: "query",
    }).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

/**
 * Removes sensitive/private fields from user documents before returning them.
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
 * Simple age check: ensures user is at least 18.
 */
function isAtLeast18(dob) {
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 18;
}

/**
 * GET /api/users/check?email=...&userName=...
 * Checks whether email and/or userName already exist.
 *
 * Returns:
 * - 409 if taken
 * - { ok: true } if available
 */
exports.checkAvailability = async (req, res, next) => {
  try {
    const email = (req.query.email || "").toString().toLowerCase().trim();
    const userName = (req.query.userName || "").toString().trim();

    if (!email && !userName) {
      return res.status(400).json({ message: "Provide email or userName" });
    }

    if (email) {
      const emailExists = await User.exists({ email });
      if (emailExists) {
        return res.status(409).json({ message: "email already exists. Choose something Else" });
      }
    }

    if (userName) {
      const userNameExists = await User.exists({ userName });
      if (userNameExists) {
        return res.status(409).json({ message: "userName already exists. Choose something Else" });
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/users
 * Registers a new user.
 *
 * Validations:
 * - Must be at least 18 years old
 * - Password length >= 6
 * - Unique email + userName (handled by MongoDB unique index)
 */
exports.registerUser = async (req, res, next) => {

    try {

        const {
            firstName,
            lastName,
            userName,
            email,
            dob,
            interest,
            level,
            goal,
            newsletter = false,
            password, // we get plain password from client
        } = req.body;

        if (!isAtLeast18(dob)) {
            return res.status(400).json({ message: "You must be at least 18 years old to register." });
        }

        if (!password || String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 charachters," });
        }

         // Hash password before storing
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email: String(email).toLowerCase().trim(),
            dob,
            interest,
            level,
            goal,
            newsletter,
            passwordHash,
        });

        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        // Handle duplicate key errors (unique indexes) (email or username)
        if (error?.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({ message: `${field} already exists. Choose something Else` });
        }
        return next(error);
    }
};