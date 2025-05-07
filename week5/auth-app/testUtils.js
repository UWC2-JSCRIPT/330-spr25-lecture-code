const mongoose = require('mongoose');
const UserModel = require('./models/user');

const models = [UserModel];

module.exports = {};

module.exports.connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    await Promise.all(models.map(model => model.syncIndexes()));
};

module.exports.stopDB = async () => {
    await mongoose.disconnect();
};

module.exports.clearDB = async () => {
    await Promise.all(models.map(model => model.deleteMany()));
}