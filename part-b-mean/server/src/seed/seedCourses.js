require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/course');
const COURSES = require('./courses.data');

function toDoc(c) {
  return {
    slug: c.id,                
    title: c.title,
    category: c.category,
    description: c.description,
    difficulty: c.difficulty,   
    available: !!c.available,
    featured: !!c.featured,
    cover: c.cover || '',
    questions: c.questions || [],
    learningGoals: c.learningGoals || [],
    sections: c.sections || [],
    recommended: c.recommended || {},
  };
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  let count = 0;
  for (const c of COURSES) {
    const doc = toDoc(c);
    await Course.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
    count++;
  }

  console.log(`Seeded/updated ${count} courses`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
