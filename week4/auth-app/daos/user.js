const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = {};

module.exports.create = async (email, plaintextPassword) => {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    const user = await User.create({email, password: hashedPassword});
    return user;
}

module.exports.getAll = async () => {
    const users = await User.find({}, {password: 0, __v: 0}).lean();
    return users;
}

module.exports.login = async (email, plaintextPassword) => {
    const user = await User.findOne({email});
    if (!user) {
        return undefined;
    }

    const hasValidPassword = await bcrypt.compare(plaintextPassword, user.password);
    if (hasValidPassword) {
        return user;
    } else {
        return undefined;
    }
}