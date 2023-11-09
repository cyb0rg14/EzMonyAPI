import express from "express";
import {
  signup,
  login,
  checkSecurityKey,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/checkSecurityKey", checkSecurityKey);

export default router;
