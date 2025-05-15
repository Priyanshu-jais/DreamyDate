const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Debug SMTP connection
    // transporter.verify(function (error, success) {
    //   if (error) {
    //     console.log("SMTP Error:", error);
    //   } else {
    //     console.log("SMTP Connection successful");
    //   }
    // });

    let info = await transporter.sendMail({
      from: `"DreamyDate" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    // console.log("Mail sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail send error details:", error);
    throw error;
  }
};

module.exports = mailSender;
