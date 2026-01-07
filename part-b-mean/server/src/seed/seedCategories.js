require('dotenv').config();

const mongoose = require('mongoose');
const Category = require('../models/category');
const CATEGORIES = require('./categories.data');

/**
 * Maps raw category data to MongoDB schema
 */
function toDoc(cat){
    return {
        legacyId: cat.id,
        title:cat.title,
        slug:cat.slug,
        description: cat.description,
        label_list:cat.label_list || [],
        info_list:cat.info_list || [],
        cover:cat.cover,
    };

}

(async ()=> {

    await mongoose.connect(process.env.MONGODB_URI);
    let count = 0;

     // Upsert categories based on slug
    for (const cat of CATEGORIES){
        const doc = toDoc(cat);
        await Category.updateOne({slug:doc.slug},{$set:doc},{upsert:true});
        count++;
    }
    console.log(`Seeded/update ${count} categories`);
    await mongoose.disconnect();
    process.exit(0);
})().catch((e)=>{
    console.error('Seed failed:',e);
    process.exit(1);

});