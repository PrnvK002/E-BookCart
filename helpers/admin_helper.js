const bcrypt = require('bcrypt');
const Admin = require('../models/admin');


function insertAdmin(data){
    return new Promise(async (resolve,reject) => {
        data.password = await bcrypt.hash(data.password , 10);
        const admin = new Admin({ 
            email : data.email , 
            password : data.password
        });
        let status = await admin.save();
        if(status){
            resolve("---------------successfully inserted data-----------------");
        }
        else{
            reject("----------------An error occured while inserting-------------");
        }
    });
}

// Login Check

function loginCheck({email,password}){
    return new Promise(async (resolve,reject) => {
        const admin = await Admin.findOne({email : email});
        if(admin){
            bcrypt.compare(password,admin.password).then((state)=>{
                if(state === true){
                    resolve(admin);
                }
                else{
                    reject("password is not matching");
                }
            });
        }
        else{
            reject("-----User cannot be found-------");
        }
    });
}


// forgot password


function updatePassword(id,password){
    return new Promise(async (resolve,reject) =>{
        let encrypted = await bcrypt.hash(password , 10);
        const status = await Admin.updateOne({ email : id },{ $set : { password : encrypted } });
        console.log("status of update");
        console.log(status);
        if(status){
            resolve("------------password updated successfully----------");
        }
        else{
            reject("--------------error occured while reseting the password----------");
        }
    });
}

// find admin


function findAdmin(email){
    return new Promise(async (resolve,reject) => {
        let admin = await Admin.findOne({email : email}).lean();
        if(admin){
            resolve(admin);
        }else{
            reject("--------------User cannot be found-------------")
        }
    })
}

module.exports = {
    loginCheck , updatePassword , findAdmin , insertAdmin
}
