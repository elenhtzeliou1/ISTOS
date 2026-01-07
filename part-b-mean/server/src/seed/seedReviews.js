require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Review = require("../models/review");
const Course = require("../models/course");
const User = require("../models/user");

const REVIEWS = require("./reviews.data");

/**
 * Splits a username into first and last name
 * Used when creating seed users
 */
function splitName(userName = "") {
  const parts = String(userName).trim().split(/\s+/);
  const firstName = parts[0] || "Seed";
  const lastName = parts.slice(1).join(" ") || "User";
  return { firstName, lastName };
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  // Default password for auto-created seed users
  const defaultPasswordHash = await bcrypt.hash("ChangeMe123!", 10);

  for (const r of REVIEWS) {
     // Try to locate course using multiple identifiers
    const course =
      (await Course.findOne({ slug: r.courseId })) ||
      (await Course.findOne({ courseId: r.courseId })) ||
      (await Course.findOne({ code: r.courseId }));

    if (!course) {
      console.warn("Skipping: course not found for:", r.courseId);
      continue;
    }

    // Find or create user
    let user = await User.findOne({ userName: r.userName });

    if (!user) {
      const { firstName, lastName } = splitName(r.userName);

      // Make an email that will pass validation + unique constraint
      const safeUser = String(r.userName).toLowerCase().replace(/[^a-z0-9]+/g, ".");
      const email = `${safeUser}.${r.userId || "seed"}@seed.local`;

      user = await User.create({
        firstName,
        lastName,
        userName: r.userName,
        email,
        dob: new Date("1990-01-01"),
        interest: "seed",
        level: "seed",
        goal: "seed",
        newsletter: false,
        passwordHash: defaultPasswordHash,
      });
    }

    // Create or update review
    await Review.findOneAndUpdate(
      { user: user._id, course: course._id },
      {
        $set: {
          rating: Number(r.rating),
          comment: String(r.comment || "").trim(),
        },
        ...(r.createdAt ? { $setOnInsert: { createdAt: new Date(r.createdAt) } } : {}),
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log("Complete Seeded reviews (including created seed users)");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
