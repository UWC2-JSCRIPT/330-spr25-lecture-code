const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  blurb: { type: String },
  publicationYear: { type: Number, required: true },
  pageCount: { type: Number, required: true }
});

bookSchema.index({ title: 1, author: 1 }, { unique: 1 })


module.exports = mongoose.model("books", bookSchema);