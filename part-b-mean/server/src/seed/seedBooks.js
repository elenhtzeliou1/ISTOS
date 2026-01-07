// Load environment variables from .env
require('dotenv').config();

// Import dependencies
const mongoose = require('mongoose');
const Book = require('../models/book');
const BOOKS = require('./books.data');

/**
 * Converts a string into a URL-friendly slug
 */
function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Maps raw book data into a MongoDB document structure
 */
function toDoc(b){
    return {
        bookId: b.id,
        slug:  `${slugify(b.title)}-${b.id}`,
        title: b.title,
        author: b.author,
        category: b.category,
        difficulty: b.difficulty,
        available: !!b.available,
        featured: !!b.featured,
        description: b.description,
        cover: b.cover || '',
    };
}

(async ()=>{
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    let count = 0;

     // Insert or update books (idempotent seeding)
    for (const b of BOOKS){
        const doc = toDoc(b);
       await Book.updateOne({ bookId: doc.bookId }, { $set: doc }, { upsert: true });
        count++;
    }

    console.log(`Seeded/updated ${count} books`);

    // Close DB connection
    await mongoose.disconnect();
    process.exit(0);
})().catch((e)=>{

    console.error('Seed Failed', e);
    process.exit(1);
})
