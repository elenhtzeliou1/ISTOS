const express = require("express");

const router = express.Router();
const booksController = require("../controllers/books.controller");


// GET /api/books/proposed
// Returns a curated / recommended list of books (optionally limited via query params)
router.get('/proposed', booksController.getProposedBooks);

// GET /api/books/by-ids?ids=1,2,3
// Returns a list of books filtered by the provided ids query parameter
router.get('/by-ids', booksController.getBooksByIds); 

// GET /api/books
// Returns all books
router.get("/", booksController.getAllBooks);

// GET /api/books/by-book-id/:bookId
// Returns a book by its external/legacy bookId field (not MongoDB _id)
router.get('/by-book-id/:bookId', booksController.getBookByBookId);

// GET /api/books/:id
// Returns a single book by MongoDB document id
router.get("/:id", booksController.getBookById);

module.exports = router;
