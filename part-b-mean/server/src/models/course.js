const mongoose = require('mongoose');

/**
 * Course schema
 * Represents a learning course with questions, goals, and sections.
 */
const CourseSchema = new mongoose.Schema(
  {
    // Unique course identifier used in routes (slug-based access)
    slug: { type: String, required: true, unique: true },

    // Core metadata
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },

    // Difficulty level (used for filtering)
    difficulty: { type: String, required: true },

    // Availability + featured flags for UI logic
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },

    // Optional cover image URL/path
    cover: { type: String },

     /**
     * Q&A content used in the course (simple structure).
     * Example:
     * { question: "What is X?", answer: "..." }
     */
    questions: [{ question: String, answer: String }],

    /**
     * Learning goals shown in the UI
     * Example: { title: "...", text: "..." }
     */
    learningGoals: [{ title: String, text: String }],

    // Generic section structure (stored as raw array from seed dataset)
    sections: { type: Array, default: [] },
    
    // Recommended content mapping (e.g., related books/videos/courses)
    recommended: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
