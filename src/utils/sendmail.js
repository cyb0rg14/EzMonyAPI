import nodemailer from "nodemailer";
import otpmail from "./otpmail.js";

// Sends an email using nodemailer with sender, receiver, and OTP.
const sendmail = async (senderMail, senderPassword, receiverMail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderMail,
      pass: senderPassword,
    },
  });

  const mailOptions = {
    from: senderMail,
    to: receiverMail,
    subject: "EzMony Verification Code",
    html: otpmail(otp),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default sendmail;
