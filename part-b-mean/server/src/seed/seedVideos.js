require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/video');
const VIDEOS = require('./videos.data');

function slugify(s) {
    return String(s || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}
function toDoc(v) {
    return {
        videoId: v.id,
        slug: `${slugify(v.title)}-${v.id}`,
        title: v.title,
        category: v.category,
        difficulty: v.difficulty,
        featured: !!v.featured,
        description: v.description,
        cover: v.cover,
        available: !!v.available,
        youtubeUrl: v.youtubeUrl,
    };
}

(async () => {

    await mongoose.connect(process.env.MONGODB_URI);
    let count = 0;
    for (const v of VIDEOS) {
        const doc = toDoc(v);
        await Video.updateOne({ videoId: doc.videoId }, { $set: doc }, { upsert: true });
        count++;
    }

    console.log(`Seeded/updated ${count} videos`);
    await mongoose.disconnect();
    process.exit(0);
})().catch((e) => {
    console.error('Seed Failed:', e);
    process.exit(1);

});