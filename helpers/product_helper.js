const Products = require('../models/product');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');



//finding a single product
function findOneProduct(id){
    let Id = mongoose.Types.ObjectId(id);
    return new Promise(async (resolve,reject) => {
        const product = await Products.findOne({_id : Id}).lean();
        if(product){
            resolve(product);
        }
        else{
            reject("--------------No Users Found----------------");
        }
    }); 
}


// finding Products 
function findProducts(data){
    return new Promise(async (resolve,reject) => {
        const products = await Products.find(data).limit(10).lean();
        if(products){
            resolve(products);
        }
        else{
            reject("--------------No Users Found----------------");
        }
    })
}


function findBestProducts(){

    return new Promise(async(resolve,reject) => {

        let products = await Products.find().sort( { number_of_buyers : -1 } ).limit(8).lean();

        if(!products){

            console.log(" ----------- Cannot find best products -------------- ");
            reject("Cannot find best products");

        }else{

            console.log("---------- Successfully found the best producst -----------");
            resolve(products);

        }
    })
}

function findNewProducts(){

    return new Promise(async (resolve,reject) => {

        let products = await Products.find().sort({ createdAt : -1 }).limit(8).lean();

        if(!products){

            console.log(" --------------- Cannot find Recently added products ----------------");
            reject("Cannot find newly added products");

        }else{

            console.log(" ----------- Successfully found Recently added products ----------------");
            resolve(products);

        }

    })

}

//inserting products

function insertProduct(data,image){

    return new Promise(async (resolve,reject) => {
        const status = await Products.create({
            productName : data.productName ,
            description : data.description,
            stock : data.stock,
            status : data.status,
            date :data.date,
            category_id : data.category,
            price : Number(data.price),
            author : data.author,
            image : image
        });
        if(status){
            resolve("---------------successfully inserted data-----------------");
        }
        else{
            reject("----------------An error occured while inserting-------------");
        }
    });
}


// Update product

function updateProduct(data,image){
    let id = mongoose.Types.ObjectId(data._id);
    if(image.length > 0){
        return new Promise(async (resolve,reject)=>{
            const status = await Products.updateOne({_id : id},{$set:{
                productName : data.productName ,
                description : data.description,
                stock : data.stock,
                status : data.status,
                date :data.date,
                category_id : data.category,
                price : data.price,
                author : data.author,
                image
            }});
            if(status){
                console.log(status);
                resolve("-----------------successfully Updated-----------------------");
            }
            else{
                reject("-----------------An error occured while updating-------------");
            }
        });

    }else{
        return new Promise(async (resolve,reject)=>{
            const status = await Products.updateOne({_id : id},{$set:{
                productName : data.productName ,
                description : data.description,
                stock : data.stock,
                status : data.status,
                date :data.date,
                category_id : data.category,
                price : data.price,
                author : data.author
            }});
            if(status){
                console.log(status);
                resolve("-----------------successfully Updated-----------------------");
            }
            else{
                reject("-----------------An error occured while updating-------------");
            }
        });
    }
}

//delete product

function deleteProduct(id) {
    return new Promise(async (resolve,reject)=>{
        const status = await Products.updateOne({ _id : id },{ $set : { deleted_status : true }});
        if(status){
            resolve("-----------------successfully deleted-----------------------");
        }
        else{
            reject("-----------------An error occured while deleting-------------");
        }
    });
}

// Activate Product

function activateProduct(id) {

    return new Promise(async (resolve,reject)=>{
        const status = await Products.updateOne({_id : id},{$set:{deleted_status : false}});
        if(status){
            resolve("-----------------successfully Activated-----------------------");
        }
        else{
            reject("-----------------An error occured while Activating-------------");
        }
    });
}

//============================== Update product offer ====================================

function updateProductOffer( search , offer_rate , check , price ){

    return new Promise(async (resolve,reject) => {
        if(check){

            console.log(search);
            console.log("category offer");
            let rate;
            // let stringRate;
            // let Id;
            let offerPrice;

            findProducts({ category_id : search }).then(async (product) => {

                let update;
                for( i in product ){

                    console.log(product[i]);

                    rate = Number(product[i].price) * (offer_rate/100);
                    offerPrice =  Number(product[i].price) - rate;
                    console.log(rate);
                    // stringRate = String(rate);
                    // Id = mongoose.Types.ObjectId(product[i].product);

                    update = await Products.updateOne({ productName : product[i].productName } , { $set : { offerPrice : offerPrice , isOffer : true } });
                    console.log(update);
                
                }

                if(!update){
    
                    console.log(update);
                    reject("------------------cannot update offer---------------------");
    
                }else{
    
                    console.log(update);
                    resolve("----------------successfully added offer on product-------------");
    
                }
            })

        } else{

            console.log(search);
            console.log("products offer");

            findOneProduct(search).then(async (product) => {
                
                // let rate = Number(product.price) - offer_rate;
                let rate = Number(product[i].price) * (offer_rate/100);
                let offerPrice =  Number(product[i].price) - rate;
                let id = mongoose.Types.ObjectId(search);
                let update = await Products.updateMany({ _id : id } , { $set : { offerPrice : offerPrice , isOffer : true } });
               
                if(!update){
    
                    console.log(update);
                    reject("------------------cannot update offer---------------------");
    
                }else{
    
                    console.log(update);
                    resolve("----------------successfully added offer on product-------------");
    
                }
            })
        }
    })
}

//==================================== Remove offer from product =================================

function updateRemoveOffer(search , check){

    return new Promise(async( resolve , reject ) => {

        if(check == true){
            
            console.log("search category");
            console.log(search);
            let update = await Products.updateMany({ category_id : search } , { $set : { offerPrice : "0" , isOffer : false } });
    
            if(!update){
    
                console.log(update);
                reject("----------------------- Failed to Remove Offer------------------");
    
            }else{
    
                console.log("-------------------Successfully removed offer--------------------");
                resolve(update);
    
            }

        }else{
            
            console.log("search product");
            console.log(search);

            let update = await Products.updateOne({ productName : search } , { $set : { offerPrice : "0" , isOffer : false } });

            if(!update){

                reject("----------------------- Failed to Remove Offer------------------");

            }else{

                console.log("------------------- Successfully removed offer -----------------------");
                console.log(update);
                resolve(update);

            }

        }


    })  

}


function productSearch(search){

    return new Promise(async (resolve,reject) => {

        let products = await Products.find({ productName : { $regex :  search , $options :'i' } }).lean();

        if(!products){

            console.log("--------------- no matches found -------------");
            reject(" no matches found ");

        }else{

            console.log("------------mathces found for search----------------");
            resolve(products);

        }

    })

}

//================= find products admin side pagination and also filter =======================

function findAdminProducts(data , limit , skip , filter , order){
    return new Promise(async (resolve,reject) => {
        if(filter == "price"){
            const products = await Products.find(data).sort({ price : order }).skip(skip).limit(limit).lean();
            if(products){
                resolve(products);
            }
            else{
                reject("--------------No Users Found----------------");
            }
        }else{
            const products = await Products.find(data).sort({ stock : order }).skip(skip).limit(limit).lean();
            if(products){
                resolve(products);
            }
            else{
                reject("--------------No Users Found----------------");
            }
        }
        
    })
}

function findPriceFilter(from , to){

    return new Promise(async (resolve,reject) => {
        console.log(from , to);
        let products = await Products.find({ $and : [ { price : { $gte : from } } , { price : { $lte : to } } ] }).lean();

        if(!products){

            console.log(products);
            console.log("--------------- Cannot find products of this price ----------------");
            reject("cannot find this range of produts");

        }else{ 

            console.log("-------------- Successfully found out the products of this price range ----------------------");
            console.log(products);
            resolve(products);

        }

    })


}

function updateStock(proData , check){

    let state = {};
    return new Promise(async( resolve , reject ) => {

        if(check){

            proData.forEach(async (element) => {
                
                console.log(element);
                let id = mongoose.Types.ObjectId(element.product_id);
                state = await Products.updateOne({ _id : id } , { $inc : { stock : -element.number , number_of_buyers : 1 } });
    
        
            });
    
            if(!state){
    
                console.log("--------------Cannot update product stock-------------------");
                reject("Cannot update product");
    
            }else{
    
                console.log(state);
                console.log("successfullly updated stock");
                resolve("---------------- Successfully update stock -------------------");
    
            }

        }else{

            proData.forEach(async (element) => {
                
                console.log(element);
                let id = mongoose.Types.ObjectId(element.product_id);
                state = await Products.updateOne({ _id : id } , { $inc : { stock : element.number , number_of_buyers : -1 } });
    
        
            });
    
            if(!state){
    
                console.log("--------------Cannot update product stock-------------------");
                reject("Cannot update product");
    
            }else{
    
                console.log(state);
                console.log("successfullly updated stock");
                resolve("---------------- Successfully update stock -------------------");
    
            }

        }

    })

}

function findProductsCount(){

    return new Promise(async(resolve,reject) => {

        let totalCount = await Products.find().count();

        if(!totalCount){

            console.log("-------------- Cannot find products count --------------------");
            reject('cannot find products count');

        }else{

            console.log("--------------- Successfully found products count --------------");
            resolve(totalCount);

        }

    });

}



module.exports = { 
    findProducts , insertProduct , updateProduct ,
     deleteProduct , findOneProduct , activateProduct ,
      updateProductOffer , updateRemoveOffer , productSearch , findNewProducts , 
       findAdminProducts , findPriceFilter , updateStock , findProductsCount , findBestProducts
}