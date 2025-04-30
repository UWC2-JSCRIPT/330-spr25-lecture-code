const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    twoFactorVerification: {type: String},
    // roles: [String]
    roles: [{
        type: String,
        enum: ['user', 'admin'],
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
