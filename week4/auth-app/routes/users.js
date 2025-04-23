const express = require('express');
const jwt = require('jsonwebtoken');
const UserDAO = require('../daos/user');

const router = express.Router();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.sendStatus(401);
    }
}

router.get('/', authMiddleware, async (req, res) => {
    const users = await UserDAO.getAll();
    return res.send(users);
});

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    await UserDAO.create(email, password);
    return res.sendStatus(201);
});

router.post('/login', async (req, res) => {
    // Get email and password from the HTTP body
    // Lookup the user by email and get the hashed password
    //   - if doesn't exist, return.... 401
    // Compare the passwords, authenticated if there's a match

    const {email, password} = req.body;
    const user = await UserDAO.login(email, password);
    if (!user) {
        return res.sendStatus(401);
    }

    const token = jwt.sign({
        email: user.email,
        userId: user._id,
    }, process.env.JWT_SECRET, {expiresIn: '30m'});

    return res.send({token});
});

module.exports = router;
