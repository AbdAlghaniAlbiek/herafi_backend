const nodemailer = require("nodemailer");
const {
  mailingKeys
} = require('../config/keys/keys');

const mailServer = mailingKeys.MAILING_SERVER;
const mailPass = mailingKeys.MAILING_PASS;
const mailEmail = mailingKeys.MAILING_EMAIL;

module.exports = {

  // async..await is not allowed in global scope, must use a wrapper
  sendMail: async (userEmail, verifyCode) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailServer, // generated ethereal user
        pass: mailPass, // generated ethereal password
      },
    });

    const mailInfo = {
      from: mailServer, // sender address
      to: userEmail, // list of receivers
      subject: "Herafi app", // Subject line
      text: "We send a verify code to you please enter it in Herafi application\n\n code:   " + verifyCode, // plain text body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailInfo, (error, info) => {
      return {
        error,
        info
      };
    });
  },

  sendMailCraftsman: async (userEmail) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailServer, // generated ethereal user
        pass: mailPass, // generated ethereal password
      },
    });

    const mailInfo = {
      from: mailServer, // sender address
      to: userEmail, // list of receivers
      subject: "Herafi app", // Subject line
      text: "Welcome our dear\nWe looking for talented people like you to grow up our company , we gonna send you your verify code to activate your account after check your data\nBe patient",
    };

    // send mail with defined transport object
    await transporter.sendMail(mailInfo, (error, info) => {
      return {
        error,
        info
      };
    });
  },

  sendMailCraftsmanForgetPassword: async (userEmail , password) => {

  	console.log(mailServer);
  	console.log(mailPass);

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: mailServer, // generated ethereal user
        pass: mailPass, // generated ethereal password
      },
    });

    const mailInfo = {
      from: mailServer, // sender address
      to: userEmail, // list of receivers
      subject: "Herafi app", // Subject line
      text: "Do you forget your password ?\nYour password is " + password,
    };

    // send mail with defined transport object
    await transporter.sendMail(mailInfo, (error, info) => {
      return {
        error,
        info
      };
    });
  }

}