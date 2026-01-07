const mongoose = require('mongoose');

/**
 * Embedded sub-schema for "label_list" items.
 * _id is disabled because these are simple value objects.
 */
const LabelSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/**
 * Embedded sub-schema for "info_list" items.
 * _id is disabled because these are simple value objects.
 */
const InfoSchema = new mongoose.Schema(
  {
    info: { type: String, required: true, trim: true },
  },
  { _id: false }
);

/**
 * Category schema
 * Used to group content (courses/books/videos).
 */
const CategorySchema = new mongoose.Schema(
  {
    // Optional legacy id (useful for mapping old datasets)
    legacyId: { type: Number, index: true },

    // Display name
    title: { type: String, required: true, trim: true },
    
    // Unique slug used in URLs and lookups
    slug: { type: String, required: true, trim: true, unique: true, index: true },

    // Category description displayed in the UI
    description: { type: String, required: true, trim: true },

    // UI helper lists (badges / key points)
    label_list: { type: [LabelSchema], default: [] },
    info_list: { type: [InfoSchema], default: [] },
    
  // Optional cover image URL/path
    cover: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
