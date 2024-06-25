require('dotenv').config();
const mongoose = require("mongoose");

function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { 
        // Remove useNewUrlParser and useUnifiedTopology options
        // They are deprecated and have no effect in newer versions
    })
    .then(() => {
        console.log('Database connected 🥳🥳🥳🥳');
    })
    .catch(err => {
        console.error('Connection failed ☹️☹️☹️☹️', err);
    });
}

module.exports = connectDB;
