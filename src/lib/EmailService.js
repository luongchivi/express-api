require('dotenv').config({ path: `${process.cwd()}/.env` });
const nodemailer = require('nodemailer');


class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  getTemplate(templateName, data) {
    switch (templateName) {
      case 'forgotPassword':
        return this.forgotPasswordTemplate(data);
      case 'welcome':
        return this.welcomeTemplate(data);
      case 'verifyEmail':
        return this.verifyEmailTemplate(data);
      // Add more templates here
      default:
        throw new Error('Template not found.');
    }
  }

  forgotPasswordTemplate({ email, resetToken }) {
    return {
      from: '"ecommerce" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Forgot password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Ecommerce Store Password Reset Request</h2>
          <p>Please click the link below to reset your password. This link will expire in 15 minutes.</p>
          <a href="${process.env.URL_SERVER_FE}/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    };
  }

  welcomeTemplate({ email, name }) {
    return {
      from: '"ecommerce" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Welcome to ecommerce',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Welcome to ecommerce, ${name}!</h2>
          <p>Thank you for signing up. We're excited to have you on board.</p>
          <p>If you have any questions, feel free to contact us at support@ecommerce.com.</p>
        </div>
      `,
    };
  }

  verifyEmailTemplate({ email, verifyEmailToken }) {
    return {
      from: '"ecommerce" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Thank you for signing up with ecommerce. Please verify your email address by clicking the link below.</p>
          <a href="${process.env.URL_SERVER_BE}/api/v1/auth/verify-email/${verifyEmailToken}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If you did not sign up for an account, please ignore this email.</p>
        </div>
      `,
    };
  }

  async sendMail(templateName, data) {
    try {
      const template = this.getTemplate(templateName, data);
      const info = await this.transporter.sendMail(template);
      return info;
    } catch (err) {
      console.log('Error when sending mail.');
      console.error(err);
    }
  }
}

module.exports = EmailService;
