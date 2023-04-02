const config = require("../config/config");
const nodemailer = require("nodemailer");

const sendEmail = (to, subject, html) => {
  return new Promise(function (resolve, reject) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    let mailOptions = {
      from: config.email.user,
      to: to,
      subject: subject + " - " + to,
      html: html,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("error::", error);
        resolve({ delivered: false, status: "Fail" });
      } else {
        resolve({ delivered: true, status: "ok" });
      }
    });
  });
};

module.exports = sendEmail;
