import express from "express";
import { signup, login, getOTP } from "../controllers/authController.js";
import joinWaitlist from "../controllers/waitlist.js";

const router = express.Router();

router.post("/waitlist", joinWaitlist);
router.post("/signup", signup);
router.post("/login", login);
router.post("/get-otp", getOTP);

export default router;
