const mongoose = require('mongoose');
const User = require('../models/user');
const Address = require('../models/address');
const { findOne, find } = require('../models/user');
const { Category } = require('../models/category');
const SubCategory = require('../models/subcategory');
const bcrypt = require('bcrypt');




/**
 * 
 * Address Management
 * 
 */


function findAddress(userId){

    let user = mongoose.Types.ObjectId(userId);
    return new Promise(async (resolve,reject) => {
        let address = await Address.find({user_id : user}).lean();
        if(address){
            resolve(address);
        }else{
            reject("---------------unable find address---------------");
        }
    })
}


function addAddress(userId , data){

        return new Promise(async (resolve,reject) => {
            let address = new Address({
                user_id : userId,
                address : data.address , 
                pin : data.pin ,
                town : data.town , 
                landmark : data.landmark ,
                additional_info : data.additionalInfo ,
                country : data.country,
                companyName : data.companyName
            });

            address.save(( err , result) => {
                if(err){
                    console.log(err);
                    reject("----------Adding new address failed---------------");
                }
                else{
                    console.log(result);
                    resolve(result);
                }
            })

            // if(state){
            //     console.log(state);
            //     resolve("--------------successfully added address------------");
            // }else{
            //     reject("---------------cannot add address--------------");
            // }
        })

}

function updateAddress( userId , data ){

    let Id = mongoose.Types.ObjectId(data.id);
    return new Promise(async (resolve,reject) => {
        let state = await Address.updateOne({ _id : Id },{
            user_id : userId,
            address : data.address , 
            pin : data.pin ,
            town : data.town , 
            landmark : data.landmark ,
            additional_info : data.additionalInfo ,
            country : data.country,
            companyName : data.companyName
        });
        if(state){
            console.log(state);
            resolve("--------------successfully updated address------------");
        }else{
            reject("---------------cannot update address--------------");
        }
    })

}


function findOneAddress(id){
   
    let Id = mongoose.Types.ObjectId(id);
   
    return new Promise(async ( resolve , reject ) => {

        let address = await Address.findOne({_id : Id}).lean();

        if(address){

            // console.log(address);
            console.log("-------------successfully found out address-----------");
            resolve(address);

        }else{
            
            console.log(address);
            reject("-------------error occured while finding address---------------");
            
        }

    }) 
}

function deleteAddress(id){

    let Id = mongoose.Types.ObjectId(id);

    return new Promise(async (resolve,reject) => {

        let status = await Address.deleteOne({ _id : Id});

        if(!status){

            reject("-------------error occured while deleting addres-------------");
            console.log(status);

        }else{

            console.log(status);
            resolve("--------successfully deleted address----------------")

        }

    })

}




//category and subcategory finding


function findCategory(){

    return new Promise(async (resolve,reject) => {

        let category = await Category.find().lean();
        if(category){
            resolve(category);
        }
        else{
            reject("-----------unable find categories----------");
        }
    });
}

function findOneCategory(id){
    return new Promise(async (resolve,reject) => {
        Category.findOne({_id : id}).then((err,data) => {
            if(!err){
                resolve(data);
            }
            else{
                reject("------------------error occured while finding category----------------");
            }
        });
    });
}




// function findSubCategory(){
//     return new Promise(async (resolve,reject) => {
//         let subCategory = await SubCategory.find().lean();
//         if(subCategory){
//             resolve(subCategory);
//         }
//         else{
//             reject("-----------unable find sub categories----------");
//         }
//     });
// }

//add category

function addCategory(data){
    return new Promise(async (resolve,reject) => {
        let status = await Category.create({categoryName : data});
        if(status){
            console.log("------successfully added category----------");
            resolve(status);
        }else{
            reject("---------couldn't add a category------------");
        }
    })
}   

//delete category

function deleteCategory(id){
    return new Promise(async (resolve,reject) => {
        let Id = await mongoose.Types.ObjectId(id);
        Category.deleteOne({_id : Id} , (error,data) => {
            if(error){
                reject("-------------error in deleting category--------------------");
            }
            else{
                resolve(data);
            }
        })
    })
}


//add sub Category

function addSubCategory(data){
    return new Promise(async (resolve,reject) => {
        let status = await SubCategory.create(data);
        if(status){
            resolve(status);
        }else{
            reject("---------couldn't add a category------------");
        }
    })
}  

// finding a single user

function findOneUser(email){

    return new Promise(async (resolve,reject) => {
        let user = await User.findOne({email : email}).lean();
        if(user){
            resolve(user);
        }else{
            reject("--------------User cannot be found-------------")
        }
    })
}

function findPhone(phone){
    return new Promise(async (resolve,reject) => {
        let user = await User.findOne({phone : phone});
        if(user){
            resolve(user);
        }else{
            reject("--------------User cannot be found-------------")
        }
    })
}
// finding User 

function findUsers(){
    return new Promise(async (resolve,reject) => {
        let users = await User.find({}).lean();
        
        if(users){
            resolve(users);
        }
        else{
            reject("--------------No Users Found----------------");
        }
    })
}

//inserting users

function insertUser(data){
    return new Promise(async (resolve,reject) => {
        data.password = await bcrypt.hash(data.password , 10);
        const status = await User.create({ 
            email : data.email , 
            fullname : data.name ,
            phone : data.phone,
            address : data.address,
            phone : data.phone,
            password : data.password
        });
        if(status){
            resolve(status);
        }
        else{
            reject("----------------An error occured while inserting-------------");
        }
    });
}


// Unblock / block user

function updateUser(id,state){
    return new Promise(async (resolve,reject)=>{
        const status = await User.updateOne({_id : id},{$set:{ block_status : state}});
        if(status){
            resolve("-----------------successfully Updated-----------------------");
        }
        else{
            reject("-----------------An error occured while updating-------------");
        }
    });
}


// update Password

function updatePassword(id,password){
    return new Promise(async (resolve,reject) =>{
        let encrypted = await bcrypt.hash(password , 10);
        const status = await User.updateOne({ email : id },{ $set : { password : encrypted } });
        if(status){
            resolve("------------User password updated successfully----------")
        }
        else{
            reject("--------------error occured while reseting the password----------")
        }
    })
}

//Check User if user exists login

function loginCheck({email,password}){
    return new Promise(async (resolve,reject) => {
        const user = await User.findOne({email : email});
        if(user && user.block_status == false){
            bcrypt.compare(password,user.password).then((state)=>{
                if(state === true){
                    resolve(user);
                }
                else{
                    reject("password is not matching");
                }
            });
        }
        else{
            reject("-----User cannot be found / blocked-------");
        }
    });
}

//updating users addresss

function updateUserDetails(userId,details){
    
    let user = mongoose.Schema.Types.ObjectId(userId);
    return new Promise(async (resolve,reject) => {
        let status = await User.updateOne({_id : user},{ $set : { details }});
        if(status){
            console.log(status);
            resolve("--------------Updated user details successfully --------------- ");
        }else{
            reject("--------------failed to update user details--------------------")
        }
    })
}

//========================== Add money to wallet =========================

function addWallet( userId ,total){

    let user = mongoose.Schema.Types.ObjectId(userId);
    return new Promise(async (resolve,reject) => {

        let update = await User.updateOne({ _id : user  },{ $inc : { wallet : total } });
        if(!update){

            console.log(update);
            reject("------ Cannot add wallet------------")

        }else{

            console.log(update);
            resolve("successfully added wallet");

        }

    })
}

//========================== Use wallet =========================

function useWallet( userId ){

    let user = mongoose.Schema.Types.ObjectId(userId);

    return new Promise(async (resolve,reject) => {

        let update = await User.updateOne({ _id : user  },{ $set : { wallet : "0" } });

        if(!update){

            console.log(update);
            reject(" wallet using failed ");

        }else{

            console.log(update);
            resolve('Successfully used wallet');

        }
    })
    

}

//===================== User helper =======================

function findTotalUser(){

    return new Promise(async (resolve,reject) => {

        let totalCount = await User.find().count();

        if(!totalCount){

            console.log(totalCount);
            console.log("Error on finding total count");
            reject("Error occured while finding the count");

        }else{

            console.log("------------- Successfully found out the total count of users ------------------------");
            resolve(totalCount);

        }

    })

}


module.exports = { 
   findPhone, findUsers , insertUser , updateUser ,findOneAddress, findTotalUser ,
        updateUserDetails , loginCheck , findOneUser , updatePassword , updateAddress , deleteAddress, useWallet,
            findCategory , addSubCategory , addCategory ,deleteCategory , findAddress , addAddress , findOneAddress , addWallet
}