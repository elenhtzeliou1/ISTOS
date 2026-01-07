const mongoose = require('mongoose');

/**
 * Video schema
 * Stores video resources (YouTube-based) used in the platform.
 */
const VideoSchema = new mongoose.Schema(
    {
        // Legacy/external numeric id (unique)
        videoId: { type: Number, required: true, unique: true },

        // URL-friendly identifier (unique)
        slug:{type:String, required:true, unique:true},

        // Basic metadata
        title: {type:String, required: true},
        category: {type:String, required: true},
        difficulty: {type:String, required: true},

        // Featured flag for "proposed/recommended" lists
        featured: {type: Boolean,default:false},

        // Description used in UI
        description: {type:String, required: true},

        // Thumbnail/cover image
        cover:{type: String},

        // Availability flag (e.g., show/hide in UI)
        available: {type:Boolean, default: true},
        
        // Video source URL (YouTube)
        youtubeUrl:{type:String},


    }
);
module.exports = mongoose.model('Video', VideoSchema);