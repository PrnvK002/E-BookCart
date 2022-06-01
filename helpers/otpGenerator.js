const otpGenerator = require("otp-generator");


function otpGenerate(){
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
}

module.exports = { otpGenerate };