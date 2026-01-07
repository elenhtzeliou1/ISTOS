// Load environment variables from .env
require('dotenv').config();

// Import dependencies
const mongoose = require('mongoose');
const Video = require('../models/video');
const VIDEOS = require('./videos.data');


/**
 * Converts text to URL-friendly slug
 */
function slugify(s) {
    return String(s || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Maps video seed data to MongoDB document
 */
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
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    let count = 0;

     // Insert or update video (idempotent seeding)
    for (const v of VIDEOS) {
        const doc = toDoc(v);
        await Video.updateOne({ videoId: doc.videoId }, { $set: doc }, { upsert: true });
        count++;
    }

    console.log(`Seeded/updated ${count} videos`);
    
     // Close DB connection
    await mongoose.disconnect();
    process.exit(0);
})().catch((e) => {
    console.error('Seed Failed:', e);
    process.exit(1);

});