const mongoose = require('mongoose');

const { Offers } = require('../models/offers');
const { Coupens } = require('../models/coupen');


//================ Adding offers ============================


function addOffer( data ){

    return new Promise(async (resolve,reject) => {


    if(data.isCategory){
    
            let state = await Offers.create({

                category : data.category,
                expiry_date : new Date(data.expiry_date),
                isCategory : true,
                offer_rate : data.offer_rate

            })

            if(!state){

                console.log(state);
                reject("-----------------error while creating the offer--------------");

            }else{

                console.log(state);
                resolve("---------------successfully created the offer---------------");

            }
    
    }else{

           
        let product = mongoose.Types.ObjectId(data.product);

    
            let state = await Offers.create({

                product  ,
                expiry_date : new Date(data.expiry_date),
                isProduct : true,
                offer_rate : data.offer_rate

            });

            if(!state){

                console.log(state);
                reject("-----------------error while creating the offer--------------");

            }else{

                console.log(state);
                resolve("---------------successfully created the offer---------------");

            }

        }

    });

}


//=========================== Remove Offer ====================================

function removeOffer(id){

    let Id = mongoose.Types.ObjectId(id);
    return new Promise(async (resolve,reject) => {

        let state = await Offers.deleteOne({ _id : Id });

        if(!state){

            console.log(state);
            reject("------------- can't remove offer -----------------");

        }else{

            console.log(state);
            resolve("---------------successfully removed offer----------");

        }

    })

}


//========================= find All offers ===================================

function findOffers(condition){

    return new Promise(async (resolve,reject) => {


        let offers = await Offers.find( condition ).populate('product','productName').lean();

        if(!offers){

            console.log(offers);
            reject("---------- cannot find offers------------------");

        }else{

            console.log("----------------succesfully found out offers------------------");
            resolve(offers);

        }

    })

}


//============================== Update Offers ========================================

function updateOffer(data){

    let id = mongoose.Types.ObjectId(data._id);
    return new Promise(async ( resolve , reject ) => {

        let state = await Offers.updateOne({ _id : id });

        if(!state){

            console.log(state);
            reject("------------------ cannot update offer ----------------------");

        }
        else{

            console.log(state);
            resolve("----------------- updated successfully ----------------------")

        }

    })

}


//========================= Adding Coupens ==================================

function addCoupen(data){


    return new Promise(async(resolve,reject) => {

        let add = await Coupens.create({

            coupenName : data.coupenName , 
            coupenCode : data.coupenCode , 
            offer_rate : data.offer_rate , 
            expiry_date : new Date(data.expiry_date)


        });

        if(!add){

            console.log(add);
            reject("---------------- Error occured while adding coupens -------------");

        }else{

            console.log(" -----------successfully added coupen--------- ");
            console.log(add);
            resolve("successfully added coupen");

        }

    })


}


//===================================== update coupen while users using the coupen ===================================

function updateCoupen( userId , id ){

    let user = mongoose.Types.ObjectId(userId); 
    let Id = mongoose.Types.ObjectId(id);

    return new Promise(async (resolve,reject) => {

        let update = await Coupens.updateOne({ _id : Id } , { $push : { users : user } }, { $inc : { user_number : 1 } } );

        if(!update){

            console.log(update);
            reject("---------------- Error occured while updating coupen-----------")

        }else{

            console.log("-----------successfully updated coupen----------------");
            resolve(update);

        }


    })

}

function removeCoupen(id){

    let Id = mongoose.Types.ObjectId(id);

    return new Promise(async (resolve,reject) => {

        let dlt = await Coupens.deleteOne({ _id : Id });

        if(!dlt){

            console.log(dlt);
            reject("----------------- Failed to delete Coupen------------");

        }
        else{

            console.log("------------- Successfully deleted coupen------------------");
            resolve(dlt);

        }

    })

}

function findCoupen(search){

    return new Promise(async (resolve,reject) => {

        let coupens = await Coupens.find(search).lean();

        if(!coupens){

            console.log("------------cannot find coupens--------------");
            console.log(coupens);
            reject("cannot find coupens");

        }else{

            console.log(" ------------successfully foundout coupens-------------- ");
            resolve(coupens);

        }

    })

}




module.exports = { findOffers , removeOffer , addOffer , updateOffer , updateCoupen , addCoupen , removeCoupen , findCoupen }