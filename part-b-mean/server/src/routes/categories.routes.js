const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

// add proposed cat here if nedded

router.get('/', categoriesController.getAllCategories);
router.get('/slug/:slug', categoriesController.getCategoryBySlug);
router.get('/:id', categoriesController.getCategoryById);

module.exports = router;