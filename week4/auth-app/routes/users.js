const express = require('express');
const UserDAO = require('../daos/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.send([{email: 'brian@uw.edu'}]);
});

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    await UserDAO.create(email, password);
    return res.sendStatus(201);
});

module.exports = router;
