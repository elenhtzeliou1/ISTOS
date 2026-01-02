const express = require("express");

const router = express.Router();
const booksController = require("../controllers/books.controller");

router.get('/proposed', booksController.getProposedBooks);
router.get('/by-ids', booksController.getBooksByIds); 

router.get("/", booksController.getAllBooks);

router.get('/by-book-id/:bookId', booksController.getBookByBookId);
router.get("/:id", booksController.getBookById);
module.exports = router;
