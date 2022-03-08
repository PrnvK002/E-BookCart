
const { required } = require('joi');
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const productSchema = Schema({
    productName : {
        type : String,
        required : true 
    },
    category_id : {
        type : String,
        required : true
    },
    
    author :{
        type : String,
        required : true
    },
    price :{
        type : Number,
        required : true
    },
    stock :{
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : Array,
        required : true
    },
    deleted_status : {
        type : Boolean,
        default : false
    },
    number_of_buyers : {
        type : Number,
        default : 0
    },
    isOffer : {
        type : Boolean,
        default : false
    },
    offerPrice : {
        type : Number,
        default : 0
    }

},{timestamps : true});
const Products = mongoose.model('products',productSchema);
module.exports = Products;