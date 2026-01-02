const mongoose = require('mongoose');


const BookSchema = new mongoose.Schema(

    {
        bookId:  { type: Number, required: true, unique: true },
        slug:{type:String, required: true, unique:true},
        title: {type:String, required: true},
        author: {type:String, required: true},

        category: {type:String, required: true},
        difficulty: {type:String, required: true},
        available: {type:Boolean, default: true},

        featured: {type: Boolean,default:false},
        description: {type:String, required: true},

        cover:{type: String},

    }

    
);

module.exports = mongoose.model('Book', BookSchema);