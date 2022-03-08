const mongoose = require('mongoose');

const Schema = mongoose.Schema;



let offerSchema = new Schema({
    category : {
        type : String,
    },
    product : {
        type : Schema.Types.ObjectId,
        ref : 'products'
    },
    expiry_date : {
        type : Date,
        required : true
    },
    isCategory : {
        type : Boolean,
        required : true,
        default : false
    },
    isProduct : {
        type : Boolean,
        required : true,
        default : false
    },
    offer_rate : {
        type : Number,
        required : true
    }
});

const Offers = mongoose.model('offers',offerSchema);
module.exports = { Offers }