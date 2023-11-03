import express from "express";
import joinWaitlist from "../controllers/waitlist.js";

const router = express.Router();

router.post("/waitlist", joinWaitlist);

export default router;
