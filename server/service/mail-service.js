const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({
  path: '../.env',
});

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_LOGIN,
        pass: process.env.GMAIL_PASSWORD,
      }
    });
  }

  async sendActivateCode(to, code) {
    this.transporter.sendMail({
      from: process.env.GMAIL_LOGIN,
      to,
      subject: 'Chat activate code',
      text: 'This message was sent activate your account',
      html:
        `<h2>Your activation code: <strong>${code}</strong></h2>`,
    })
  }
}


module.exports = new MailService()