const mongoose = require('mongoose');
const app = require('./app');

const PORT = 3000;

// Connect to the DB
mongoose.connect('mongodb://127.0.0.1:27017/auth-app').then(() => {
    console.log('DB connected!');

    // Start the server
    app.listen(PORT, () => {
        console.log('App is running on localhost:3000');
    });
});
