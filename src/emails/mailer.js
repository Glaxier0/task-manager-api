const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const sendWelcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: 'Thanks for joining in!',
            text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
        })
    } catch (error) {
        throw new Error('Mail did not send')
    }
}

const sendCancelationEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: 'Sorry to see you go!',
            text: `Goodbye, ${name}. Hope to see you back sometime soon.`
        })
    } catch (error) {
        throw new Error('Mail did not send')
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}