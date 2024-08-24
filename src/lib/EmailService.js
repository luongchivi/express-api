require('dotenv').config({ path: `${process.cwd()}/.env` });
const nodemailer = require('nodemailer');
const moment = require('moment');
const { formatMoney } = require('../routes/shared');


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
      case 'checkOut':
        return this.checkOutTemplate(data);
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

  checkOutTemplate({
    email, name, orderItemsInformation, totalAmount, shippingFee, expectedDeliveryTime,
  }) {
    const itemsHtml = orderItemsInformation.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e5e7eb;">
      <div style="display: flex; align-items: center;">
        <img src="${item.product.thumbImageUrl}" alt="${item.product.name}" style="width: 100px; height: auto; object-fit: cover; border-radius: 4px;"/>
        <div style="margin-left: 15px; max-width: 390px;">
          <h3 style="margin: 0 0 5px; font-size: 18px; font-weight: 600; color: #333; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${item.product.name}
          </h3>
          <p style="margin: 0; color: #6b7280;">${formatMoney(item.unitPrice)} VND</p>
          <p style="margin: 0; color: #6b7280;">Quantity: ${item.quantity}</p>
          <p style="margin: 0; color: #6b7280;">Total: ${formatMoney(item.quantity * item.unitPrice)} VND</p>
        </div>
      </div>
    </div>
  `).join('');

    return {
      from: '"ecommerce" <no-reply@ecommerce.com>',
      to: email,
      subject: 'Your Order Confirmation',
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 500px;">
        <h2 style="color: #333;">Thank you for your purchase, ${name}!</h2>
        <p style="margin: 0 0 15px;">Here are the details of your order:</p>
        <p style="font-size: 16px; font-weight: 500; color: #4b5563; margin-bottom: 20px;">Expected Delivery Time: <span style="color: #d90606;">${moment(expectedDeliveryTime).format('DD/MM/YYYY HH:mm')}</span></p>
        <div style="border-top: 1px solid #e5e7eb; max-height: 600px; overflow-y: auto; margin-bottom: 20px;">
          ${itemsHtml}
        </div>
        <div>
          <p style="font-size: 16px; font-weight: 500; color: #4b5563; margin: 5px 0;">Shipping Fee: <span style="font-size: 18px; font-weight: 600; color: #333;">${formatMoney(shippingFee)} VND</span></p>
          <p style="font-size: 16px; font-weight: 500; color: #4b5563; margin: 5px 0;">Total Amount: <span style="font-size: 20px; font-weight: 700; color: #d90606;">${formatMoney(totalAmount)} VND</span></p>
        </div>
        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">If you have any questions, feel free to contact us at <a href="mailto:support@ecommerce.com" style="color: #3b82f6; text-decoration: none;">support@ecommerce.com</a>.</p>
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
