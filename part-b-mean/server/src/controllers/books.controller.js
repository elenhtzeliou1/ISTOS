const Book = require('../models/book');



exports.getAllBooks = async (req, res, next) => {

    try {
        const books = await Book.find().lean();
        const normalized = books.map(b => ({
            ...b,
            difficulty: b.difficulty || b.level
        }));

        res.status(200).json(normalized);
    } catch (err) {
        next(err);
    }

};

exports.getBookById = async (req,res,next)=>{

    try {
        const book = await Book.findById(req.params.id);
        if (!book){
            return res.status(404).json({message: 'Book not Found'});

        }
        res.status(200).json(book);
    }catch(err){
        res.status(400).json({message:'Invalid Book Id'});
    }

};

exports.getBooksByIds = async (req, res, next) => {
  try {
    const ids = String(req.query.ids || '')
      .split(',')
      .map(x => parseInt(x.trim(), 10))
      .filter(n => Number.isFinite(n));

    if (!ids.length) return res.json([]);

    const books = await Book.find({ bookId: { $in: ids } }).lean();
    res.json(books);
  } catch (err) {
    next(err);
  }
};
exports.getBookByBookId = async (req, res, next) => {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    if (!Number.isFinite(bookId)) return res.status(400).json({ message: "Invalid bookId" });

    const book = await Book.findOne({ bookId }).lean();
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    next(err);
  }
};

//get proposed books
exports.getProposedBooks = async (req,res,next)=>{

    try{
        const limit = Math.min(parseInt(req.query.limit || '4',10),20);
        let proposed = await Book.find({featured:true}).limit(limit).lean();

        if (proposed.length <limit){
            const remaining = limit - proposed.length;
            const excludeIds = proposed.map(b =>b._id);

            const extras = await Book.find ({
                featured:{$ne:true},
                _id: {$nin:excludeIds},
            }).limit(remaining).lean();
            proposed = proposed.concat(extras);
        }
        res.json(proposed);

    }   catch(err){
        next(err);
    }
}