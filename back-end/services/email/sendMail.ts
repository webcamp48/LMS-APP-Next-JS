require("dotenv").config();
import nodemailer, {Transporter} from 'nodemailer';

// email interface
interface EmailOptions {
    email: string,
    subject: string,
    template: string
    data: {[key: string]: any}
}

// sendMail handler
const sendMail = async (options: EmailOptions):Promise <void> => {

    // Configure nodemailer
    const transporter : Transporter = nodemailer.createTransport ({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const {email, subject, template} = options;

    // const html: string = template;


    // mailOptions
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html : template,
    }

    // send otp through email
    await transporter.sendMail(mailOptions);

}

export default sendMail;