import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Compiles an email content with the given OTP.
function compileEmailContent(otp) {
  const currentModuleURL = import.meta.url;
  const currentModulePath = fileURLToPath(currentModuleURL);
  const htmlFilePath = path.join(currentModulePath, "..", "otpmail.html");
  const htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  const compiledHTML = htmlTemplate.replace("${otp}", otp);
  return compiledHTML;
}

// Sends an email using nodemailer with sender, receiver, and OTP.
const sendmail = (senderMail, senderPassword, receiverMail, otp) => {
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
    html: compileEmailContent(otp),
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
