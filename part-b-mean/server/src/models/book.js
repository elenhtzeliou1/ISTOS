const mongoose = require('mongoose');

/**
 * Book schema
 * Stores book metadata used by the client (list + details pages).
 * Notes:
 * - `bookId` is a legacy/external numeric id from the seed dataset.
 * - `slug` is a URL-friendly identifier used in routes and lookups.
 */
const BookSchema = new mongoose.Schema(

    {
        // Legacy/external book id (unique)
        bookId:  { type: Number, required: true, unique: true },
        
        // SEO-friendly identifier (unique)
        slug:{type:String, required: true, unique:true},
        
        // Basic metadata
        title: {type:String, required: true},
        author: {type:String, required: true},

        // Category + difficulty are used for filtering on the client
        category: {type:String, required: true},
        difficulty: {type:String, required: true},
        
        // Availability flag (e.g., show/hide in UI)
        available: {type:Boolean, default: true},

         // Featured items can be shown in "recommended/proposed" sections
        featured: {type: Boolean,default:false},
        
          // Short description shown on details page/cards
        description: {type:String, required: true},

        // Cover image URL/path
        cover:{type: String},

    }

    
);

module.exports = mongoose.model('Book', BookSchema);