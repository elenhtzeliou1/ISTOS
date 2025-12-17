const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, required: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);