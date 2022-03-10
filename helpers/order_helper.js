const mongoose = require('mongoose');
const { Orders } = require('../models/orders');
const Razorpay = require('razorpay');
const paypal = require('paypal-rest-sdk');
const { RAZORPAY_ID , RAZORPAY_KEY_SECRET , PAYPAL_ID , PAYPAL_SECRET , STRIPE_SECRET_KEY , STRIPE_PUBLISHABLE_KEY } = require('../config/config');
const { date } = require('joi');

const stripe = require("stripe")(STRIPE_SECRET_KEY);


/*

Adding orders

*/

function placeOrder( data , userId , id , paymentMethod , total ){
    

    let user = mongoose.Types.ObjectId(userId);
    let total_prize = Number(total);

    return new Promise(async (resolve,reject) => {

        if(paymentMethod == "cash on delivery"){
        let order = new Orders({
    
            user_id : user,
            products : data.products ,
            address : id, 
            payment_method : paymentMethod,
            total_prize : total_prize,
            
        });

        order.save(( err , result ) => {

            if(err){
                console.log(err);
                reject("---------------cannot place order------------------");
            }
            else{
                console.log("---------------successfully placed the order-------------");
                // console.log(result);
                resolve(result);
            }

        }) 
    }
    else{
        let order = new Orders({
    
            user_id : user,
            products : data.products ,
            address : id, 
            payment_method : paymentMethod,
            total_prize : total_prize,
            order_status : "pending"
            
        });

        order.save(( err , result ) => {

            if(err){
                console.log(err);
                reject("---------------cannot place order------------------");
            }
            else{
                console.log("---------------successfully placed the order-------------");
                // console.log(result);
                resolve(result);
            }

        }) 

    }
        


    })

}

/*

** finding orders

*/

function findOneOrder( userId ){

    let user = mongoose.Types.ObjectId(userId);

    return new Promise(async (resolve,reject) => {

        let d = await Orders.find({user_id : user, 'order_status' : "Order Placed"}).populate('products.product_id',"_id productName image price").populate('address').sort({ordered_date : -1 }).lean();
        
        if(d){

            // console.log(d);
            resolve(d);
        
        }else{

            console.log(d);
            reject("----------cannot find Orders-------------");
        
        }
    });
}

// function addAnOrder(userId , data){
    
//     let user = mongoose.Types.ObjectId(userId);
    
//     let order = {
//         products : data.products , 
//         payment_method : data.payment_method,
//         total_prize : data.total_prize,
//     }

//     return new Promise(async (resolve , reject) => {
//         let status = Orders.create({ user_id : user } , { $push : { 'orders' : order } });
//         if(status){
//             console.log(status);
//             resolve("-------------successfully updated the order------------");
//         }else{
//             reject("----------error occured while adding order---------------");
//         }
//     });
// }


function updateDeliveryStatus( order_id , status ){
    
    let id = mongoose.Types.ObjectId(order_id);
    
    return new Promise(async (resolve,reject) => {
        
        let state = await Orders.updateOne({ _id : id } , { $set : { order_status : status } } );
        if(state.aknowledged){

            console.log(state);
            reslolve("-------------successfully updated status-----------------");
        
        }else{

            console.log(state);
            reject("----------------error occured while updating status------------");
        
        }

    })
}


/**
 * 
 * *cancel an order
 * 
 */

function cancelOrder(order_id){

    let id = mongoose.Types.ObjectId(order_id);
    
    return new Promise(async (resolve , reject) => {

        let state = await Orders.updateOne({ _id : id },{ $set : { order_status : "cancelled" , cancel_status : true }});

        if(state.acknowledged){

            console.log(state);
            resolve("----------------order canceled successfully-------------");

        }else{

            console.log(state);
            reject("-------------------error while cancelling order-----------------");

        }

    })

}

function findAllOrders( search , sort ){
    
    return new Promise(async (resolve,reject) => {
    
        let orders = await Orders.find(search).populate('products.product_id',"_id productName image price").populate('user_id',"fullname").populate('address').sort({ ordered_date : sort }).lean();

        if(orders.length > 0){

            resolve(orders);
            
        }else{
            console.log(orders);
            reject("--------------error while finding all orders----------------");
        }
    
    })

}


function findAllUserOrders(userId , sort){

    let Id = mongoose.Types.ObjectId(userId);
      
    return new Promise(async (resolve,reject) => {
    
        let orders = await Orders.find( {user_id : Id }).populate('products.product_id',"_id productName image price").populate('user_id',"fullname").populate('address').sort({ ordered_date : sort }).lean();

        if(orders.length > 0){

            resolve(orders);
            
        }else{
            console.log(orders);
            reject("--------------error while finding all orders----------------");
        }
    
    })



}

/**
 * 
 * Razor pay setting order start
 * 
 */

 var instance = new Razorpay({
    key_id: `${RAZORPAY_ID}`,
    key_secret: `${RAZORPAY_KEY_SECRET}`,
  });




function generateRazorpay( orderId , amount ){

    let Amount = Number(amount)*100;

    return new Promise(( resolve ,reject ) => {
        instance.orders.create({
            amount: Amount,
            currency: "INR",
            receipt: "" + orderId,
          },(err,order) =>{
              if(err){
                console.log("razorpay failed");
                  console.log(err);
                  reject(err);
              }else{
                  console.log("razorpay success");
                  console.log(order);
                  resolve(order);
              }
          });
    });
}


function validatePayment(details){
    return new Promise(( resolve , reject ) => {
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256' , '7MK95y5uPGGcDtfD8WWAqdkK');

        hmac.update(details.razorpay_order_id+'|'+details.razorpay_payment_id);
        hmac = hmac.digest('hex');

        if(hmac == details.razorpay_signature){
            resolve("----------------Payment Successfull-------------");
        }
        else{
            reject('----------------payment failed---------------');
        }

    });
}


function updateOrderAndPaymentStatus(order_id , payment_status , order_status ){
    let id = mongoose.Types.ObjectId(order_id);
    return new Promise(async ( resolve , reject ) => {
        
        let update = await Orders.updateOne({_id : id} , { $set : { order_status : order_status , payment_status : payment_status }});

        if(update){
            console.log(update);
            resolve("------------updated order status-------------");
        }else{
            console.log(update);
            reject("-------------error occured while updating-----------------");
        }

    });
}



/**
 * 
 * Razor pay setting order end
 * 
 */

/**
 * 
 *  Paypal setting order start
 * 
 */

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': `${PAYPAL_ID}`,
    'client_secret': `${PAYPAL_SECRET}`
});

function generatePaypal( products , total_amount ){

    let item = {};
    let itemss = [];
    
    products.forEach((p) => {
        // console.log(p);
        item.name = p.product_id.productName;
        item.price = p.product_id.price;
        item.currency = "INR",
        item.quantity = p.number;
        itemss.push(item);
    })

    console.log(itemss);

    return new Promise((resolve,reject) => {
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/paypal_success",
                "cancel_url": "http://localhost:3000/paypal_cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": itemss
                },
                "amount": {
                    "currency": "INR",
                    "total": `${total_amount}`
                },
                "description": "Hat for the best team ever"
            }]
        };
        
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
              console.log(error);
            //   throw error;
          } else {
            //   for(let i = 0;i < payment.links.length;i++){
            //     if(payment.links[i].rel === 'approval_url'){
            //       res.redirect(payment.links[i].href);
            //     }
            //   }
            console.log(payment);
          }
        });
        
    });
}




/**
 * 
 *  Paypal setting order end
 * 
 */


/**
 * 
 * Stripe Setting Up
 * 
 */

function generateStripe(total){

    let amount = total * 100;
    return new Promise(async (resolve,reject) => {
           
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount ,
            currency: "inr",
            automatic_payment_methods: {
              enabled: true,
            },
          });
          
        if(paymentIntent){

            console.log(paymentIntent);
            resolve(paymentIntent.client_secret)

        }else{

            console.log("stripe failure");
            reject("------------Error occured while paying stripe----------------");

        }
          

    })

}


/**
 * 
 * Stripe Setting Up end
 * 
 */


/**
 * 
 * Admin dashboard calculations
 * 
 */


function monthlyOrders(){

    let data = {};

    return new Promise(async (resolve,reject)=>{
        
        let date1 = new Date("2022-01-01");
        let date2 = new Date("2022-01-31");

        let count1 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.january = count1[0] || 0;

        date1 = new Date("2022-02-01");
        date2 = new Date("2022-02-28");

        let count2 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        console.log(count2);

        data.february = count2[0] || 0;

        date1 = new Date("2022-03-01");
        date2 = new Date("2022-03-31");

        let count3 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.march = count3[0] || 0;

        date1 = new Date("2022-04-01");
        date2 = new Date("2022-04-30");

        let count4 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);


        data.april = count4[0] || 0;

        date1 = new Date("2022-05-01");
        date2 = new Date("2022-05-31");

        let count5 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.may = count5[0] || 0;

        date1 = new Date("2022-06-01");
        date2 = new Date("2022-06-30");

        let count6 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.june = count6[0] || 0;

        date1 = new Date("2022-07-01");
        date2 = new Date("2022-07-31");

        let count7 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.july = count7[0] || 0;

        date1 = new Date("2022-08-01");
        date2 = new Date("2022-08-30");

        let count8 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.august = count8[0] || 0;

        date1 = new Date("2022-09-01");
        date2 = new Date("2022-09-31");

        let count9 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.september = count9[0] || 0;

        date1 = new Date("2022-10-01");
        date2 = new Date("2022-10-30");

        let count10 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.october = count10[0] || 0;

        date1 = new Date("2022-11-01");
        date2 = new Date("2022-11-31");
        
        let count11 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.november = count11[0] || 0;

        date1 = new Date("2022-12-01");
        date2 = new Date("2022-12-30");

        let count12 =  await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : date1 } } , { 'ordered_date' : { $lte : date2 } } ] } } , { $count : "order_count" } ]);

        data.december = count12[0] || 0;

        if(!data){

            console.log("---------------------------- Cannot find order count -------------------------------");
            console.log(data);
            reject("Cannot find orders")

        }else{

            // console.log(data);
            console.log("-------------------------- Successfully found out order count -----------------------");
            resolve(data);

        }

    });
}

function monthlyRevenue(){

    let data = {};

    return new Promise(async ( resolve , reject ) => {

        // let months = [ "January" , "February" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December" ];

        let revenue1 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date("2022-01-01")} } , { 'ordered_date' : { $lte : new Date("2022-01-31") } } ] }} , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);

        data.january = revenue1[0] || 0;

        let revenue2 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date("2022-02-01") } } , { 'ordered_date' : { $lte : new Date("2022-02-28") } } ] } } , { $group : { _id : null , total : { $sum : '$total_prize' } } } ]);

        data.february = revenue2[0] || 0;

        let revenue3 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-03-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-03-31`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.march = revenue3[0] || 0;

        let revenue4 = await Orders.aggregate([ { $match :  {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-04-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-04-30`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.april = revenue4[0] || 0;

        let revenue5 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-05-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-05-31`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.may = revenue5[0] || 0;

        let revenue6 = await Orders.aggregate([ { $match :{  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-06-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-06-30`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.june = revenue6[0] || 0;

        let revenue7 = await Orders.aggregate([ { $match :{  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-07-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-07-31`) } } ] }} , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.july = revenue7[0] || 0;

        let revenue8 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-08-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-08-30`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.august = revenue8[0] || 0;

        let revenue9 = await Orders.aggregate([ { $match :{  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-09-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-09-31`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);

        data.september = revenue9[0] || 0;

        let revenue10 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-10-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-10-30`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);


        data.october = revenue10[0] || 0;
        
        let revenue11 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-11-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-11-31`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);

        data.november = revenue11[0] || 0;

        let revenue12 = await Orders.aggregate([ { $match : {  $and : [ { 'ordered_date' : {  $gte : new Date( `2022-12-01` ) } } , { 'ordered_date' : {  $lte : new Date(`2022-12-30`) } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);

        data.december = revenue12[0] || 0;


        if(!data){

            console.log(data);
            console.log("---------------- Cannot find totals of this month ------------------");
            reject("Cannot find monthly revenue")

        }else{

            console.log("----------------- Found out totals of this month -------------------");
            console.log(data);
            resolve(data);

        }
    })
}

function yearlyOrders(){

    let data = {};

    return new Promise(async (resolve,reject) => {

        //=================== 2018 - 19 ===============

        let y1 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2018-01-01') } } , { 'ordered_date' : { $lte : new Date('2018-12-30') } } ] } } , { $count : "order_count" } ]);
        data.eighteen = y1[0] || 0;
        
        //=================== 2019 - 20 ===============

        let y2 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2019-01-01') } } , { 'ordered_date' : { $lte : new Date('2019-12-30') } } ] } } , { $count : "order_count" } ]);
        data.nineteen = y2[0] || 0;

        //=================== 2020 - 21 ===============

        let y3 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2020-01-01') } } , { 'ordered_date' : { $lte : new Date('2020-12-30') } } ] } } , { $count : "order_count" } ]);
        data.twenty = y3[0] || 0;

        //=================== 2021 - 22 ===============

        let y4 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2021-01-01') } } , { 'ordered_date' : { $lte : new Date('2021-12-30') } } ] } } , { $count : "order_count" } ]);
        data.twentyone = y4[0] || 0;

        //==================== 2022 - 23 =================

        let y5 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2022-01-01') } } , { 'ordered_date' : { $lte : new Date('2022-12-30') } } ] } } , { $count : "order_count" } ]);
        data.twentytwo = y5[0] || 0;

        if(!data){

            console.log(data);
            console.log("--------------------- Cannot find order count of the years -------------------");
            reject("cannot find order count of the years");

        }else{

            console.log("--------------------- Successfully found count by the years -------------------");
            // console.log(data);
            resolve(data);

        }

    })

}

function yearlyRevenue(){

    let data = {};

    return new Promise(async (resolve,reject) => { 

     //=================== 2018 - 19 ===============

     let y1 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2018-01-01') } } , { 'ordered_date' : { $lte : new Date('2018-12-30') } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);
     data.eighteen = y1[0] || 0;
     
     //=================== 2019 - 20 ===============

     let y2 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2019-01-01') } } , { 'ordered_date' : { $lte : new Date('2019-12-30') } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);
     data.nineteen = y2[0] || 0;

     //=================== 2020 - 21 ===============

     let y3 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2020-01-01') } } , { 'ordered_date' : { $lte : new Date('2020-12-30') } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);
     data.twenty = y3[0] || 0;

     //=================== 2021 - 22 ===============

     let y4 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2021-01-01') } } , { 'ordered_date' : { $lte : new Date('2021-12-30') } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);
     data.twentyone = y4[0] || 0;

     //==================== 2022 - 23 =================

     let y5 = await Orders.aggregate([ { $match : { $and : [ { 'ordered_date' : { $gte : new Date('2022-01-01') } } , { 'ordered_date' : { $lte : new Date('2022-12-30') } } ] } } , { $group : { _id : null , total : { $sum : "$total_prize" } } } ]);
     data.twentytwo = y5[0] || 0;

     if(!data){

        console.log(data);
        console.log("--------------------- Cannot find order total of the years -------------------");
        reject("cannot find order total of the years");

    }else{

        console.log("--------------------- Successfully found total of years -------------------");
        console.log(data);
        resolve(data);

    }

    })

}

function  recentOrders(){

    return new Promise(async (resolve,reject) => {

        let orders = await Orders.find().populate('products.product_id',"_id productName price").populate('user_id',"fullname").sort({ ordered_date : -1 }).limit(6).lean();

        if(!orders){

            console.log(orders);
            console.log("------------ cannot find orders -----------------");
            reject("cannot find orders");

        }else{

            console.log("------------ Successfully find orders --------------");
            resolve(orders);

        }

    });

}

function totalOrderCount(){

    return new Promise(async (resolve,reject) => {
        
        let count = await Orders.find().count();
        if(!count){

            console.log("---------- Cannot find orders count ---------");
            console.log(count);
            reject("Cannot find orders count");

        }else{

            console.log("------------- Successfully found out orders count --------------");
            resolve(count);

        }

    })

}

function totalIncome(){

    return new Promise(async (resolve,reject) =>{

        let total = await Orders.aggregate([ { $group : { _id : null , totalAmount : { $sum : "$total_prize"  } } } ])

        if(total.length == 0){

            console.log(total);
            console.log("Error occured while finding total income");
            reject("Error occured while finding total income");

        }
        else{

            console.log("--------------- successfully found out total prize ---------------");
            console.log(total);
            resolve(total[0].totalAmount);

        }
    })
}


function salesReport( from , to ){

    // console.log(from);
    // console.log(to);

    let From = new Date(from);
    let To = new Date(to);
    console.log(From);
    console.log(To);

    return new Promise(async (resolve,reject) => {

        let report = await Orders.aggregate([

                { $match : { $and : [ { ordered_date : { $gte : From } } , { ordered_date : { $lte : To } } ] } } , 
                { $unwind : "$products" } , 
                { $lookup : { from : "products" , localField : "products.product_id" , foreignField : "_id" , as: "product_info" } } ,
                { $unwind : "$product_info" } ,
                { $group : { _id : "$product_info.productName" , totalSoldCount : { $sum : "$products.number" } , totalAmount : { $sum : "$products.item_total"} } },
               
                ]);

//{ $group : { _id : "$products.product_id" , totalSoldCount : { $sum : "$products.number" } , totalAmount : { $sum : "$products.item_total"  } } } 
        if(!report){

            console.log(report);
            reject("cannot find report");

        }else{

            console.log("successfully found out the report");
            console.log(report);
            resolve(report);

        }

    });


}

/**
 * 
 * Admin dashboard calculations
 * 
 */

/**
 * 
 * Delete order start
 * 
 */

function deleteOrder(id){

    let Id = mongoose.Types.ObjectId(id);
    return new Promise(async ( resolve , reject ) => {

        let dlt = await Orders.deleteOne({ _id : Id });

        if(!dlt){

            console.log("-------------- Cannot delete offer -----------------");
            reject("Deleting order failed due some error");

        }else{

            console.log("--------------- Successfully deleted order -------------");
            resolve("Successfully removed the order");

        }
    })

}

/**
 * 
 * Delete order end
 * 
 */

function findOrder(id){

    let Id = mongoose.Types.ObjectId(id);
    return new Promise(async (resolve,reject) => {

        let order = await Orders.findOne({ _id : Id }).lean();

        if(!order){

            console.log("------------- Cannot find order ------------------");
            reject("Order cannot be find check the id");

        }else{

            console.log("----------------- Offer found successfully -----------");
            resolve(order);

        }

    })

}


module.exports = {  placeOrder , findOneOrder , totalIncome, deleteOrder , findAllUserOrders , 
                    cancelOrder , findAllOrders , recentOrders, totalOrderCount , findOrder ,
                    updateDeliveryStatus , generateRazorpay  , generateStripe, yearlyOrders , salesReport,
                    validatePayment , updateOrderAndPaymentStatus , monthlyOrders , monthlyRevenue , yearlyRevenue }