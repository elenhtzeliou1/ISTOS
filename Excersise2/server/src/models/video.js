const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema(
    {
        videoId: { type: Number, required: true, unique: true },
        slug:{type:String, required:true, unique:true},
        title: {type:String, required: true},
        category: {type:String, required: true},
        difficulty: {type:String, required: true},
        featured: {type: Boolean,default:false},
        description: {type:String, required: true},
        cover:{type: String},
        available: {type:Boolean, default: true},
        youtubeUrl:{type:String},
    }
);
module.exports = mongoose.model('Video', VideoSchema);