const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String }
    },
    { timestamps: true }
);

// one review per user per course
ReviewSchema.index({user:1, course:1}, {unique:true});

module.exports = mongoose.model('Review', ReviewSchema);