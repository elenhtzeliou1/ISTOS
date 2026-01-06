const Course = require('../models/course');


//get All courses for course-page
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().lean();
    // normalize for safety
    const normalized = courses.map(c => ({
      ...c,
      difficulty: c.difficulty || c.level
    }));
    res.status(200).json(normalized);
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


//get only proposed courses
exports.getProposedCourses = async (req, res, next) => {

  try {
    const limit = Math.min(parseInt(req.query.limit || '5', 10), 20);


    // first prefer featured = true only
    let proposed = await Course.find({ featured: true }).limit(limit).lean();


    //fallback if fewer that limit
    if (proposed.length < limit) {
      const remaining = limit - proposed.length;
      const excludeIds = proposed.map(c => c._id);

      const extras = await Course.find({
        featured: { $ne: true },
        _id: { $nin: excludeIds },
      }).limit(remaining).lean();

      proposed = proposed.concat(extras);
    }
    res.json(proposed);
  } catch (err) {
    next(err);
  }


};