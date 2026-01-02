const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const InfoSchema = new mongoose.Schema(
  {
    info: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const CategorySchema = new mongoose.Schema(
  {
    legacyId: { type: Number, index: true },

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },

    description: { type: String, required: true, trim: true },

    label_list: { type: [LabelSchema], default: [] },
    info_list: { type: [InfoSchema], default: [] },

    cover: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
