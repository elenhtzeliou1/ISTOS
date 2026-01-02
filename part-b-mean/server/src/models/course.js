const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {

    slug: { type: String, required: true, unique: true },

    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },

    difficulty: { type: String, required: true },

    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    cover: { type: String },

    questions: [{ question: String, answer: String }],

    learningGoals: [{ title: String, text: String }],
    sections: { type: Array, default: [] },
    recommended: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
