const nodemailer = require('nodemailer');
const mail = require('../utils/mailMarkUp');
require('dotenv').config();

class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'testcosmo11@gmail.com',
        pass: 'test23test23cosmo'
      }
    });
    this.mailOptions = {
      from: '"Cosmo Project" <testcosmo11@gmail.com>',
      to: '',
      subject: '',
      html: ''
    };
  }

  createSignInMail(token) {
    const url = `${process.env.URL}?token=${token}`;
    return mail.signInMail(url);
  }

  async sendSignInMail(email, token) {
    this.mailOptions.to = email;
    this.mailOptions.subject = 'Sign in';
    this.mailOptions.html = this.createSignInMail(token);
    return await this.transporter.sendMail(this.mailOptions);
  }
}

module.exports = new Mail();
