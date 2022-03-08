const Joi = require('joi');


const signupSchema = Joi.object({
    name : Joi.string().required() , 
    email: Joi.string().email().required() ,
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.ref('password'),
}); 

const loginSchema = Joi.object({
    email: Joi.string().email().required() ,
    password: Joi.string().min(6).required(),
}); 

// password validator while resetinfg password
const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.ref('password')
});


module.exports ={
    signupSchema , loginSchema ,resetPasswordSchema
}
