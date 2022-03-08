const nodemailer = require("nodemailer");

module.exports.sendMail = function (mailid, otp) {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "testerkannapan123@gmail.com",
      pass: "Thegod@123",
    },
  });

  let mailDetails = {
    from: "testerkannapan123@gmail.com",
    to: mailid,
    subject: "cofirmation mail",
    text: `This is the mail from e-commerce book app 
    This is to verify that you had an account here 
    To complete the verification enter the otp here :
    ${otp}`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs" + err);
    } else {
      console.log("Email sent successfully");
      console.log(data);
    }
  });
};
