const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId
    }
})

const coupenSchema = new Schema({
    coupenName : {
        type : String,
        required : true
    },
    coupenCode : {
        type : String,
        required : true 
    },
    user_number : {
        type : Number,
        default : 0
    },
    users : { 
        type : [ userSchema ],
    },
    offer_rate : { 
        type : Number,
        required : true
    },
    expiry_date : {
        type : Date,
        required : true
    }
},{timestamps : true});

const Coupens = mongoose.model('coupens',coupenSchema,'coupens');


module.exports = { Coupens };