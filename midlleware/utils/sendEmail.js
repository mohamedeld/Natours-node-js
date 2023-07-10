
const nodemailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions ={
        from:'mohamed elsayed <mohamedhassan32023@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.text
    }
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;