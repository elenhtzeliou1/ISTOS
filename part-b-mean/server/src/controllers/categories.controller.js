const Category = require("../models/category");

/**
 * GET /api/categories
 * Returns all categories.
 * Normalizes `id` to match the legacy dataset (legacyId).
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();

    // Add "id" field for compatibility with older data structure
    const normalized = categories.map((cat) => ({
      ...cat,
      id: cat.legacyId || cat.id,
    }));

    res.status(200).json(normalized);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/categories/:id
 * Returns a category by MongoDB _id.
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: "Invalid Category id" });
  }
};

/**
 * GET /api/categories/slug/:slug
 * Returns a category by slug (SEO-friendly identifier).
 */
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = String(req.params.slug || "")
      .trim()
      .toLowerCase();

    const category = await Category.findOne({ slug }).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};
