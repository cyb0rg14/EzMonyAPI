import { generateOTP, validateOTP } from "./otpController.js";
import sendmail from "../utils/sendmail.js";
import Waitlist from "../models/Waitlist.js";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import "dotenv/config";

const { AUTH_EMAIL, AUTH_PASS } = process.env;

// Generates and sends an OTP to the provided email.
export const getOTP = async (req, res) => {
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

// Handles user signup, checking for existing users and validating OTP.
export const signup = async (req, res) => {
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

// Handles user login, checking for user existence and validating OTP.
export const login = async (req, res) => {
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


