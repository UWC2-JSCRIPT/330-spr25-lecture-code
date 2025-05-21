const { Router } = require("express");
const router = Router();

router.use("/books", require('./books'));

module.exports = router;