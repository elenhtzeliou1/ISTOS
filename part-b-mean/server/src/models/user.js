const mongoose = require("mongoose");

/**
 * User schema
 * Represents an authenticated platform user.
 * Notes:
 * - `passwordHash` is stored instead of plaintext password.
 * - `passwordHash` is excluded from queries by default via `select: false`.
 */
const UserSchema = new mongoose.Schema(
  {
    // Basic profile info
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    // Unique username used for login/identity
    userName: { type: String, required: true, trim: true, unique: true },

    // Email with validation + uniqueness
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    // Additional user attributes used by personalization / onboarding
    dob: { type: Date, required: true },
    interest: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },

    newsletter: { type: Boolean, default: false },

    /**
     * Hashed password (never return by default)
     * Note: select:false prevents exposing it unless explicitly requested.
     */
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
