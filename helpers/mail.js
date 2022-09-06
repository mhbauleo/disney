const { createTransport } = require("nodemailer");
const mailConfig = require("../config/mailConfig");

const SERVER_MAIL = mailConfig.GMAIL_SERVER_MAIL;
const PASSWORD = mailConfig.GMAIL_PASSWORD;

const sendEmail = async (subject, html, to) => {
  const transporter = createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: SERVER_MAIL,
      pass: PASSWORD,
    },
  });

  const mailOptions = {
    from: "Server Node.js",
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info)
} catch (error) {
    console.log(error);
  }
};

module.exports = { sendEmail };
