const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const ENV = dotenv.config().parsed;

class Mailer {
    transporter; 
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: ENV.MAIL_HOST,
            port: ENV.MAIL_PORT,
            secure: false,
        });        
    }

    async sendMail ({to, from, subject, msg, plainMsg, ccs, bccs}) {
        let response = await this.transporter.sendMail({
            from,
            to,
            subject,
            html: msg,
            text: msg,
        });
        
        return response;
    }
}



module.exports = Mailer;