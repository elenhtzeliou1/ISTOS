const mongoose = require("mongoose");
const Enrollment = require("../models/enrollment");

exports.createEnrollment = async (req, res) => {
  try {
    const userId = req.userId; 
    const { course } = req.body; 

    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const row = await Enrollment.findOneAndUpdate(
      { user: userId, course },
      { $setOnInsert: { user: userId, course } },
      { upsert: true, new: true }
    );

    return res.status(201).json(row);
  } catch (err) {
    return res.status(400).json({ message: "Invalid Enrollment Data" });
  }
};
