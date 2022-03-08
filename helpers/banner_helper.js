const { Banners } = require('../models/banner');

function insertBanner(image,expiry_date){
    return new Promise(async (resolve,reject) => {
        let status = await Banners.create({
            images : image,
            expiry_date : expiry_date
        });
        if(status){
            console.log('successfully inserted product');
            resolve(status);
        }else{
            reject("unable to insert");
        }
    })
}

function findBanner(){
    return new Promise(async (resolve,reject) => {
        let Offers = await Banners.find().lean();
        if(Offers){
            resolve(Offers);
        }else{
            reject("unable to find offers");
        }
        
    })
}

function removeBanner(id){
    return new Promise(async (resolve,reject) => {
        let status = await Banners.deleteOne({ _id : id});
        if(status){
            resolve(status);
        }else{
            reject("Cannot delete offer");
        }
    })
}


module.exports = {
    insertBanner , findBanner , removeBanner
}