const Book = require("../models/book");

/**
 * GET /api/books
 * Returns all books.
 * Uses .lean() for performance (returns plain JS objects instead of Mongoose docs).
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().lean();
    // Normalize difficulty field (some datasets may use "level")
    const normalized = books.map((b) => ({
      ...b,
      difficulty: b.difficulty || b.level,
    }));

    res.status(200).json(normalized);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/books/:id
 * Returns a book by MongoDB _id.
 */
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not Found" });
    }
    res.status(200).json(book);
  } catch (err) {
    // If the id is not a valid ObjectId format
    res.status(400).json({ message: "Invalid Book Id" });
  }
};

/**
 * GET /api/books/by-ids?ids=1,2,3
 * Returns books by legacy/external `bookId` list.
 */
exports.getBooksByIds = async (req, res, next) => {
  try {
    // Parse ids query param to an array of numbers
    const ids = String(req.query.ids || "")
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((n) => Number.isFinite(n));

    if (!ids.length) return res.json([]);

    const books = await Book.find({ bookId: { $in: ids } }).lean();
    res.json(books);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/books/by-book-id/:bookId
 * Returns a single book by legacy/external bookId.
 */
exports.getBookByBookId = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    if (!Number.isFinite(bookId))
      return res.status(400).json({ message: "Invalid bookId" });

    const book = await Book.findOne({ bookId }).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/books/proposed?limit=4
 * Returns a proposed/recommended list of books.
 *
 * Logic:
 * - Prefer featured=true books first
 * - If not enough featured books exist, fill the remaining slots with non-featured books
 * - Limit is capped to 20 for safety
 */
exports.getProposedBooks = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "4", 10), 20);

    // 1) take featured books
    let proposed = await Book.find({ featured: true }).limit(limit).lean();

    // 2) if fewer than limit, fill with non-featured extras
    if (proposed.length < limit) {
      const remaining = limit - proposed.length;
      const excludeIds = proposed.map((b) => b._id);

      const extras = await Book.find({
        featured: { $ne: true },
        _id: { $nin: excludeIds },
      })
        .limit(remaining)
        .lean();
      proposed = proposed.concat(extras);
    }
    res.json(proposed);
  } catch (err) {
    next(err);
  }
};
