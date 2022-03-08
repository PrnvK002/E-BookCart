const mongoose = require('mongoose');
const {MONGO_URI} = require('./config');


const connectDB = async ()=>{
    // const MONGO_URI = "mongodb+srv://user123:1tSATe2jgPj6F0Sa@blogs.ej6tx.mongodb.net/e-book_shop?retryWrites=true&w=majority"


    try {
        const conn = mongoose.connect(MONGO_URI);
        console.log(`MONGO DB connected`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;