require('dotenv').config();
// Import dependencies (express)
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET env var not provided');
}

const PORT = 3000;

// Create the app, setup JSON parsing
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date()}`);
    next();
});

// Use the user routes
app.use('/users', userRoutes);


// Connect to the DB
mongoose.connect('mongodb://127.0.0.1:27017/auth-app').then(() => {
    console.log('DB connected!');

    // Start the server
    app.listen(PORT, () => {
        console.log('App is running on localhost:3000');
    });
});
