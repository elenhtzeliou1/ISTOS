const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    dob: { type: Date, required: true },
    interest: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },

    newsletter: { type: Boolean, default: false },
    //never rutern hased pass unless it is explicity selected
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);