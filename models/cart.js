const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productsSchema = new Schema({
    product_id : {
        type : Schema.Types.ObjectId,
        required : true,
        ref: "products"
    },
    number : {
        type : Number,
        required: true
    },
    item_total : {
        type : Number,
        required : true
    }
    ,
    date : {
        type :Date ,
        default : Date.now()
    }
})


const cartSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        required : true
    },
    products : [ productsSchema ],

    total_price : {
        type : Number,
        required : true
    },
    
},{timestamps : true});

const Cart = mongoose.model('cart',cartSchema);
module.exports = {
    Cart
}