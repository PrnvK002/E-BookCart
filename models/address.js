const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    pin : {
        type : String,
        required : true
    },
    town : {
        type : String,
        required : true
    },
    landmark : {
        type : String,
        required : true
    },
    additional_info : {
        type : String
    },
    country : {
        type : String
    },
    companyName : {
        type : String
    }

});

const Address = mongoose.model('address',addressSchema);

module.exports = Address;