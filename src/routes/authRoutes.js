 // import express from "express";
const express = require('express')
// import { joinWaitlist, signup, login, getOTP } from "../controllers/authController.js";
const { joinWaitlist, signup, login, getOTP } = require("../controllers/authController.js");

const router = express.Router();

router.post("/waitlist", joinWaitlist);
router.post("/signup", signup);
router.post("/login", login);
router.post('/get-otp', getOTP)

// export default router;
module.exports = router