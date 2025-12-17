const Course = require('../models/course');

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(400).json({ message: 'Invalid course ID' });
    }
};