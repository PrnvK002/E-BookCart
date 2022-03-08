// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const { TWILIO_ACCOUNT_SID , TWILIO_ACCOUNT_AUTH_TOKEN } = require('../config/config');




const accountSid =`${TWILIO_ACCOUNT_SID}`;
const authToken = `${TWILIO_ACCOUNT_AUTH_TOKEN}`;
const client = require('twilio')(accountSid, authToken);

function sendOtp(phone,otp){

    client.messages.create({ body: `Your OTP for login is ${otp}`, from: '+16203180271', to: `+91${phone}`}).then(message => 
        {
            console.log("message sent");
            console.log(message.sid)
        }).catch((err) => {
            console.log(err);
        })
    
}

module.exports = { sendOtp };

