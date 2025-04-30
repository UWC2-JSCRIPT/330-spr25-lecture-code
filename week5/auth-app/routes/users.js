const express = require('express');
const jwt = require('jsonwebtoken');
const UserDAO = require('../daos/user');
const User = require('../models/user');

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

const adminOnly = (req, res, next) => {
    if (req.user.roles.includes('admin')) {
        return next();
    }
    return res.sendStatus(403);
};

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

    // const twoFactorAuthCode = '40400';
    // await UserDAO.addTwoFactorAuthCode(email, twoFactorAuthCode);

    // return res.send({
    //     message: 'Verify 2 factor auth',
    //     link: '/users/verify',
    // });

    const token = jwt.sign({
        email: user.email,
        userId: user._id,
        roles: user.roles, // add roles
    }, process.env.JWT_SECRET, {expiresIn: '30m'});

    return res.send({token});
});

router.post('/verify', async (req, res) => {
    const {email, twoFactorAuthCode} = req.body;
    const user = await UserDAO.verifyTwoFactorAuthCode(email, twoFactorAuthCode);
    if (!user) {
        return res.sendStatus(401);
    }

    const token = jwt.sign({
        email: user.email,
        userId: user._id,
    }, process.env.JWT_SECRET, {expiresIn: '30m'});

    return res.send({token});
});

// PATCH /some-user-id/password
router.patch('/:id/password', authMiddleware, async (req, res) => {
    const userIdToUpdate = req.params.id;
    const loggedInUserId = req.user.userId;
    
    // Is the user authorized with the correct role to access the id?
    // If so, change the password and return 200
    if (userIdToUpdate === loggedInUserId || req.user.roles.includes('admin')) {
        await UserDAO.changePassword(userIdToUpdate, req.body.password);
        return res.sendStatus(200);
    }

    // If not, return forbidden (403)
    return res.sendStatus(403);
});

// PATCH /some-user-id
router.patch('/:id', authMiddleware, adminOnly, async (req, res) => {
    // req = {
    //     body: {
    //         roles: ['admin']
    //     }
    // }

    const {roles} = req.body;
    const {id} = req.params;
    
    await UserDAO.updateRoles(id, roles);
    return res.sendStatus(200);
});

module.exports = router;
