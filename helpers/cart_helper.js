const mongoose = require('mongoose');
const {Cart} = require('../models/cart');
const {Products} = require('../models/product');
const { Wishlist } = require('../models/wishlist');
const { findOneProduct } = require('./product_helper');


// finding cart Items

function findCart(userId){
    let user = mongoose.Types.ObjectId(userId);
    return new Promise(async(resolve,reject) => {
        let cart = await Cart.findOne({user_id : user}).lean();
        if(cart){
            resolve(cart);
        }
        else{
            reject("------------cannot find cart for this user ------------");
        }
    })
}


// inserting new Cart

function insertCart(proId,userId,price){
    let user = mongoose.Types.ObjectId(userId)
    let prodId = mongoose.Types.ObjectId(proId);
    let item_total = price;
    let product = {
        product_id : prodId,
        number : 1,
        item_total: item_total,
        date : Date.now()
    }
    return new Promise((resolve,reject) => {
        Cart.create({
            user_id : user,
            products : [ product ],
            total_price : price
        }).then((err,result) => {
            if(err){
                reject(err);
            }else{
                console.log(result);
                resolve(result);
            }
        });
    });
}

// updating cart items

function updateCartCount(userId,price,proId,count){
    let product = mongoose.Types.ObjectId(proId);
    let user = mongoose.Types.ObjectId(userId)
    return new Promise(async (resolve,reject) => {
        if(count == 1){
            let update = await Cart.updateOne({
                'user_id' : user,
                'products.product_id' : product  
            },{$inc : {
                'products.$.number' : count,
                'products.$.item_total' : price,
                'total_price' : price
            }});
            if(update){
                console.log("------------successfully updated cart count--------------");
                resolve(update);
            }
            else{
                reject("-----------error occured while updating count----------------")
            }
        }
        else{

            let update = await Cart.updateOne({
                'user_id' : user,
                'products.product_id' : product  
            },{
                $inc : {
                'products.$.number' : count,
                'products.$.item_total' : -price,
                'total_price' : -price
            }});
            if(update){
                console.log("------------successfully updated cart count--------------");
                resolve(update);
            }
            else{
                reject("-----------error occured while updating count----------------")
            } 
        }
    })
}

function updateCart(userId,proId,price){
    // let user = mongoose.Types.ObjectId(userId);
    let prodId = mongoose.Types.ObjectId(proId);
    let product = {
        product_id : prodId,
        number : 1,
        item_total : price,
        date : Date.now()
    }
    return new Promise(async (resolve,reject) => {
            let state = await Cart.updateOne({user_id : userId},{$push : {products : product} , $inc : { total_price : price }});
            if(state){
                console.log(state);
                resolve("--------------successfully updated cart------------------------");
            }else{
                console.log(state);
                reject("----------------error occured while updating cart-----------------");
            }
    });
}

// finding product and details using aggregate

function findCartProducts(userId){
    console.log("User id");
    console.log(userId);
    let user = mongoose.Types.ObjectId(userId);
    return new Promise(async(resolve,reject) => {
    let all = await Cart.findOne({ user_id : user }).populate("products.product_id","productName category_id price image isOffer offerPrice").lean();
        if(all.products.length == 0){

            console.log(all);
            reject("error while doing aggregation");
            
        }else{
            
            console.log("---------------aggregation-----------------");
            console.log(all);
            resolve(all);

        }
    })
}


function deleteCartItem(userId,proId,price,count){
    let user = mongoose.Types.ObjectId(userId);
    let prodId = mongoose.Types.ObjectId(proId);
    let total = count * price ;
    return new Promise(async (resolve,reject) => {
        let dlt = await Cart.updateOne({user_id : user},{ "$pull" : { "products" :{ "product_id" : proId } } , "$inc" : { "total_price" : -total }  });
        if(dlt){
            console.log("-----------------successfully removed product from cart--------------");
            resolve(dlt)
        }else{
            reject("--------------------error occured whilte removing from cart--------------------")
        }
    })
}


function findCartProductCount(userId){
    console.log(userId);
    let user = mongoose.Types.ObjectId(userId);
    return new Promise(async (resolve,reject) => {
        let c = await Cart.findOne({ user_id : user });
        if(c){
            let count = 0;
            for(i in c.products){
                count+=c.products[i].number;
            }
            resolve(count);
        }else{
            reject("cannot find the cart of this user");
        }
    })
}


/**
 * 
 * Wishlist start
 * 
 */

function findWishlistCount(userId){

    let user = mongoose.Types.ObjectId(userId);
    return new Promise(async ( resolve , reject ) => {
        let wishlist = await Wishlist.findOne({ user_id : user }).lean();
        if(wishlist){
            console.log("successfully found wishlist");
            resolve(wishlist.products.length);
        }else{

            resolve(0)

        }
    }) 

}



function findWishlist(userId){

    let user = mongoose.Types.ObjectId(userId);
    
    return new Promise(async ( resolve , reject ) => {

        let wishlist = await Wishlist.findOne({ user_id : user }).populate('products.product_id').lean();

        if(wishlist){

            console.log("successfully found wishlist of this user");
            resolve(wishlist);

        }
        else{

            console.log("cannot find wishlist of this user");
            reject("----------cannot find wishlist of this user----------");

        }

    }); 

}



function addToWishlist(userId , proId){

    let user = mongoose.Types.ObjectId(userId);
    let product = mongoose.Types.ObjectId(proId);
    let prod = { product_id : product }

    return new Promise(async (resolve,reject) => {
        let status = await Wishlist.create({
            user_id : user,
            products : [ prod ]
        });

        if(status){
            console.log(status);
            resolve("----------successfully inserted wishlist-------------");
        }
        else{
            console.log(status);
            reject("------------unable to insert to wishlist---------------");
        }

    })
}



function updateWishlist(userId , proId){

    let user = mongoose.Types.ObjectId(userId);
    let product = mongoose.Types.ObjectId(proId);
    let prod = { product_id : product }


    return new Promise(async (resolve,reject) => {
        
        let update = await Wishlist.updateOne({ user_id : user } , { $push : { products : prod } });
        if(update){
            console.log(update);
            resolve("-------------product added to wishlist-------------");
        }else{

            console.log(update);
            reject("--------------cannot add product to wishlist----------");

        }

    })
}


function removeWishlist(userId , proId){

    let user = mongoose.Types.ObjectId(userId);
    let product = mongoose.Types.ObjectId(proId);

    return new Promise(async (reslove,reject) => {
        
        let update = await Wishlist.updateOne({ user_id : user },{ $pull : { products : { product_id : product } } });

        if(update){

            console.log(update);
            reslove("-----------successfully removed from the wish list-------------")

        }else{

            console.log(update);
            reject("------------error occured while removing proudct from wish list------------");

        }

    })
}



/**
 * 
 * Wishlist End
 * 
 */



module.exports = {
    findCart , findCartProducts ,
     insertCart , updateCart ,
      updateCartCount , deleteCartItem  ,
       findCartProductCount ,
        addToWishlist , removeWishlist ,
         updateWishlist , findWishlist , findWishlistCount 
}