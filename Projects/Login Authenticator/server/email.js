const nodemailer = require('nodemailer');

const sendPassChangeEmail = (userID, recipient, confirmationKey) => {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "no.reply.login.authenticator@gmail.com",
            pass: "uhbadvlnqpfcrytd"
        }
    });

    let bodyMessage = "<h2>Hello dear user,</h2>";
    bodyMessage += "<p>We have identified a request to change your password, please click on the link below:</p>";
    bodyMessage += `<p><a href='http://localhost:8383/password?id=${userID}&key=${confirmationKey}'>Change Password</a></p>`
    
    return transport.sendMail({
        from: "Login Authenticator <no.reply.login.authenticator@gmail.com>",
        to: recipient,
        subject: "Password Change Request",
        html:  bodyMessage
    })
}

module.exports = {
    sendPassChangeEmail
}
