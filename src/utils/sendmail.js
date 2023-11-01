import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function compileEmailContent(otp) {
  const currentModuleURL = import.meta.url;
  const currentModulePath = fileURLToPath(currentModuleURL);
  const htmlFilePath = path.join(currentModulePath, "..", "otpmail.html");
  const htmlTemplate = fs.readFileSync(htmlFilePath, "utf8");
  const compiledHTML = htmlTemplate.replace("${otp}", otp);
  return compiledHTML;
}

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
