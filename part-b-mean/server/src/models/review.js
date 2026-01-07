const mongoose = require('mongoose');


/**
 * Review schema
 * Stores a user's rating/comment for a course.
 */
const ReviewSchema = new mongoose.Schema(
    {
        // The author of the review
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        
        // The reviewed course
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        
        // Rating is restricted to 1–5
        rating: { type: Number, required: true, min: 1, max: 5 },
        
        // Optional free-text comment
        comment: { type: String }
    },
    { timestamps: true }
);

/**
 * Ensure a user can leave only one review per course.
 */
ReviewSchema.index({user:1, course:1}, {unique:true});

module.exports = mongoose.model('Review', ReviewSchema);