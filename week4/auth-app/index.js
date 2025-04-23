// Import dependencies (express)
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');

// Create the app, setup JSON parsing
const app = express();
app.use(express.json());

// Use the user routes
app.use('/users', userRoutes);

// Connect to the DB

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log('App is running on localhost:3000');
});