const nodemailer = require("nodemailer");
const { recompileSchema } = require("../Models/UserModel");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "sriharidinesh.20bcd7236@vitap.ac.in",
    pass: "ddky gfiq gtlq lxwi",
  },
});
const mailOptions = {
    from: {
      name: "Tericsoft",
      address: "sriharidinesh.20bcd7236@vitap.ac.in",
    }, 
    to: "", 
    subject: "", 
    text: "Hello world?", 
    html: "<b>Your Order has been placed suceesfully</b>", 
  };
exports.Email = async (recipientEmail,subject,htmlfield) => {
    try {
      // Define email options
      mailOptions
        mailOptions.to=recipientEmail
        mailOptions.subject=subject
        mailOptions.html=htmlfield
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("Error sending login email notification:", error);
      // Handle error
    }
  };
