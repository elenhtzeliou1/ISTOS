const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

// Category routes
// GET /api/categories
// Returns all categories
router.get('/', categoriesController.getAllCategories);

// GET /api/categories/slug/:slug
// Returns a category by slug (SEO-friendly identifier)
router.get('/slug/:slug', categoriesController.getCategoryBySlug);

// GET /api/categories/:id
// Returns a category by MongoDB document id
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;