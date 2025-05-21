const { Router } = require("express");
const router = Router();
const yup = require('yup');

const bookDAO = require('../daos/book');
const bookAPI = require('../apis/bookAPI');

const bookSchema = yup.object({
  title: yup.string().required(),
  author: yup.string().required(),
  genre: yup.string().optional(),
  blurb: yup.string().optional(),
  publicationYear: yup.number().integer().required(),
  pageCount: yup.number().integer().required().min(1)
})

// Create
router.post("/", async (req, res, next) => {
  const book = req.body;
  try {
    await bookSchema.validate(book, { abortEarly: false });
  } catch(err) {
    return res.status(400).json(err.errors);
  }

  try {
    const savedBook = await bookDAO.create(book);
    res.json(savedBook); 
  } catch(e) {
    if (e.message.includes('duplicate')) {
      return res.sendStatus(409)
    }
    next(e)
  }
});

// Read - single book
router.get("/:id", async (req, res, next) => {
  try {
    const book = await bookDAO.getById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next(e);
  }
});

// Read - all books
router.get("/", async (req, res, next) => {
  try {
    let { page, perPage } = req.query;
    page = page ? Number(page) : 0;
    perPage = perPage ? Number(perPage) : 10;
    const books = await bookDAO.getAll(page, perPage);
    res.json(books);
  } catch(e) {
    next(e);
  }
});

// Update
router.put("/:id", async (req, res, next) => {
  const bookId = req.params.id;
  const book = req.body;
  try {
    await bookSchema.validate(book, { abortEarly: false });
  } catch(err) {
    return res.status(400).json(err.errors);
  }
  try {
    const success = await bookDAO.updateById(bookId, book);
    res.sendStatus(success ? 200 : 400); 
  } catch(e) {
    if (e instanceof bookDAO.BadDataError) {
      res.status(400).send(e.message);
    } else {
      res.status(500).send(e.message);
    }
  }
});

// Delete
router.delete("/:id", async (req, res, next) => {
  const bookId = req.params.id;
  try {
    const success = await bookDAO.deleteById(bookId);
    res.sendStatus(success ? 200 : 400);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

//GET book ISBN
router.get("/:id/ISBN", async (req, res, next) => {
  const bookId = req.params.id;
  try {
    const book = await bookDAO.getById(bookId);
    if (!book) {
      return res.sendStatus(404);
    }
    const ISBN = await bookAPI.getISBN(book.title, book.author);
    res.json({ ISBN });
  } catch(e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;