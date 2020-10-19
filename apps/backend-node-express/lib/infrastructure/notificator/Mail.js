const nodemailer = require('nodemailer');
const sendmailTransport = require('nodemailer-sendmail-transport');
const smtpTransport = require('nodemailer-smtp-transport');
const debugTransport = require('nodemailer-stub-transport');

const { getTemplate } = require('./utils/templates');

const TRANSPORTS_BY_TYPE = {
  SMTP: smtpTransport,
  SENDMAIL: sendmailTransport,
  DEBUG: debugTransport
};

class EmailSender {
  constructor({ mailOptions, mainUrl } = {}) {
    const { transport: transportType, transportOptions } = mailOptions || {};

    const transport = TRANSPORTS_BY_TYPE[transportType](transportOptions);

    if (!transport) throw new Error('Transport not found');

    this.transport = nodemailer.createTransport(transport, transportOptions);
    this.mainUrl = mainUrl;
    this.mailOptions = mailOptions;
  }

  // for testing
  setTransport(transport) {
    this.transport = transport;
  }

  async notify(type, destinationEmail, data) {
    const sendData = { ...data, mainUrl: this.mainUrl };
    const template = await getTemplate(type);
    return this.sendEmail({
      from: this.mailOptions.from,
      to: destinationEmail,
      subject: template.subject(sendData),
      html: template.body(sendData)
    });
  }

  async sendEmail(data) {
    const response = await this.transport.sendMail(data);
    return response.messageId;
  }
}

module.exports = EmailSender;
