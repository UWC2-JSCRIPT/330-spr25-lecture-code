// Import dependencies (express)
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

const PORT = 3000;

// Create the app, setup JSON parsing
const app = express();
app.use(express.json());

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
