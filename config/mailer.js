const nodemailer = require('nodemailer');
// DOTENV for ENV variables
const dotenv = require('dotenv');
const ENV = dotenv.config().parsed;

/**
 * Mailer Class
 * 
 * A simpel class that handles abstracting how to send mail through NodeMailer
 * 
 */
class Mailer {
    // instance variable -- this is the transport that is created from NodeMailer
    transporter; 

    /**
     * Constructor
     * 
     * simply creates and stores the transport in the instance variable using the 
     * data from the ENV variable
     */
    constructor() {
        
        this.transporter = nodemailer.createTransport({
            host: ENV.MAIL_HOST,
            port: ENV.MAIL_PORT,
            secure: false,
        });        
    }

    /**
     * sendMail async method
     * 
     * T
     * 
     * @param {
     *  to: (String) Email address to send the mail to,
     *  from: (String) Email Address who sent it,
     *  subject: (String) Subject of the Email
     *  msg: (String) The message to send to the user. Recommended to be in plain text at this time.
     * } param 
     * @returns Returns if the mail was sent or not
     */
    async sendMail ({to, from, subject, msg, plainMsg, ccs, bccs}) {
        let response = await this.transporter.sendMail({
            from,
            to,
            subject,
            // Wrap the msg in white-space preline style so the message has line breaks in html
            html: `<div style="white-space: pre-line">${msg}</div>`,
            text: msg,
        });
        
        return response;
    }
}



module.exports = Mailer;