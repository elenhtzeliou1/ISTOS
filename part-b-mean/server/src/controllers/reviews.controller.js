const Review = require('../models/review');

exports.createReview = async (req, res, next) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Invalid Review Data' });
    }
};