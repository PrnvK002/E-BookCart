const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    product_id :{ 
        type : Schema.Types.ObjectId ,
        ref : 'products',
        required : true
    } 
})


let wishlistSchema = new Schema({
    user_id : {
        type : Schema.Types.ObjectId,
        required : true
    },
    products : [ productSchema ]
} , 
{timestamps : true} );


const Wishlist = mongoose.model('wishlist',wishlistSchema);
module.exports = { Wishlist }