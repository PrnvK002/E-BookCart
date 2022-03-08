
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
});

// const addressSchema = new Schema({

//     _id : {
//         type : Schema.Types.ObjectId,
//         required : true,
//         ref: "address"
//     }
    
// })

// let date = new Date();
// let now = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() ; 

// console.log(now);

const orderSchema = mongoose.Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'users'

    },

    address : {
        type : Schema.Types.ObjectId,
        required : true ,
        ref : "address"
    },

    products : [productsSchema],

    payment_method : {
        type : String,
        required : true
    },
    payment_status : {
        type : String,
        default : "Not paid"
    },
    total_prize : {
        type : Number,
        required : true
    },
    order_status: {
        type: String,
        default : "Order Placed"
    },
    cancel_status : {
        type : Boolean , 
        default : false
    },
    ordered_date : { type: Date, default: new Date() },
    delivery_date: { type : Date }
    
});


const Orders = mongoose.model('orders',orderSchema);
module.exports = { Orders };