const Enrollment = require('../models/enrollment');

exports.createEnrollment = async (req, res, next) => {
    try {
        const enrollment = new Enrollment(req.body);
        await enrollment.save();
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid Enrollment Data' });
    }
};