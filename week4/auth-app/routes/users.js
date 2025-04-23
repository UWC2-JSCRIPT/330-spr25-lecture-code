const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send([{email: 'brian@uw.edu'}]);
});

module.exports = router;
