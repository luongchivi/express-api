require('dotenv').config({path: `${process.cwd()}/.env`});
const nodemailer = require('nodemailer');

async function sendMail(email, html){
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    let info = await transporter.sendMail({
      from: '"ecommerce" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Forgot password',
      html: html
    })

    return info;
  } catch (err) {
    console.log('Error when sending mail.')
    console.error(err);
  }
}

module.exports = sendMail;
