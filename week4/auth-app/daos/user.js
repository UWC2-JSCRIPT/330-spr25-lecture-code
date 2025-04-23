const User = require('../models/user');

module.exports = {};

module.exports.create = async (email, password) => {
    const user = await User.create({email, password});
    return user;
}
