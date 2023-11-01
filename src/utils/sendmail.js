import nodemailer from "nodemailer";
import { promises as fs } from "fs";

// Compiles an email content with the given OTP.
async function compileEmailContent(otp) {
  const htmlTemplate = await fs.readFile(process.cwd() + "/src/utils/otpmail.html", "utf8");
  const compiledHTML = htmlTemplate.replace("${otp}", otp);
  return compiledHTML;
}

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
    html: await compileEmailContent(otp),
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
