const { generateOTP, validateOTP } = require("./otpController.js");
const sendmail = require("../utils/sendmail.js");
const Waitlist = require("../models/Waitlist.js");
const User = require("../models/User.js");
const OTP = require("../models/OTP.js");
require("dotenv").config();


const { AUTH_EMAIL, AUTH_PASS } = process.env;


const getOTP = async (req, res) => {
  const { email } = req.body;
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 5);
  try {
    const otp = generateOTP();
    const existingOTP = await OTP.findOne({ email });
    if (existingOTP) {
      existingOTP.otp = otp;
      existingOTP.createdAt = new Date();
      existingOTP.expiresAt = expirationTime;
      await existingOTP.save();
    } else {
      const newOTP = new OTP({ email, otp });
      await newOTP.save();
    }
    sendmail(AUTH_EMAIL, AUTH_PASS, email, otp);
    res.status(200).send(`OTP successfully sent to ${email}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const signup = async (req, res) => {
  const { fullname, email, otp } = req.body;
  try {
    const existedUser = await User.findOne({ email });
    const existedOTP = await OTP.findOne({ email });
    if (existedUser) {
      res.status(400).send("User already exists");
    }
    if (existedOTP) {
      if (validateOTP(otp, existedOTP)) {
        const user = await User.create({ fullname, email });
        res.status(201).send(user);
      } else {
        res.status(400).send("Invalid OTP");
      }
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existedUser = await User.findOne({ email });
    const existedOTP = await OTP.findOne({ email });
    if (!existedUser) {
      res.status(400).send("No user associated with this email");
    } else {
      if (validateOTP(otp, existedOTP)) {
        res.status(200).send(existedUser);
      } else {
        res.status(400).send("Invalid OTP");
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const joinWaitlist = async (req, res) => {
  const email = req.body.email;
  const existingEmail = await Waitlist.findOne({ email: email });
  try {
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "Email already exists in the waitlist" });
    } else {
      const wlEmail = await Waitlist.create({ email });
      res.status(200).json(wlEmail);
    }
  } catch (error) {
    console.log("Error occured while adding email to waitlist", error);
  }
}

module.exports = {
  getOTP,
  signup,
  login,
  joinWaitlist,
}