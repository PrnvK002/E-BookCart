const dotenv = require('dotenv');

//load config
dotenv.config({ path : './config/config.env'});

module.exports = {
    MONGO_URI : process.env.MONGO_URI,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
    PORT : process.env.PORT,
    TWILIO_ACCOUNT_SID : process.env.TWILIO_ACCOUNT_SID,
    TWILIO_ACCOUNT_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ,
    RAZORPAY_ID : process.env.RAZORPAY_ID,
    RAZORPAY_KEY_SECRET : process.env.RAZORPAY_KEY_SECRET,
    PAYPAL_ID : process.env.PAYPAL_ID,
    PAYPAL_SECRET : process.env.PAYPAL_SECRET,
    STRIPE_PUBLISHABLE_KEY : process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY
}