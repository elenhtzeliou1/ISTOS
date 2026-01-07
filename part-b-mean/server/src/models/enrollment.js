const mongoose = require("mongoose");

/**
 * Enrollment schema
 * Connects a user to a course they enrolled in.
 * Used for access control (e.g., only enrolled users can write reviews).
 */
const EnrollmentSchema = new mongoose.Schema(
  {
    // Reference to the enrolled user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // Reference to the course
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

/**
 * Ensure a user can enroll only once per course.
 * (user + course) pair must be unique.
 */
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
