// Import dependencies (express)
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET env var not provided');
}

// Create the app, setup JSON parsing
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date()}`);
    next();
});

// Use the user routes
app.use('/users', userRoutes);

module.exports = app;