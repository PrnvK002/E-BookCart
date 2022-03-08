const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId:{
        type :String
    },
    email : {
        type : String,
        required:true
    },
    fullname : {
        type : String,
        required :  true
    },
    phone : {
        type : String,
    },
    password : {
        type : String
    },
    image : {
        type : String
    },
    walllet : {
        type : String
    },
    date: { 
        type: Date, 
        default: Date.now },
    block_status : { 
        type : Boolean , 
        default : false}
    
});

const User = mongoose.model('users',userSchema);

module.exports = User;