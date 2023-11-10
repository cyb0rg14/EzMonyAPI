import express from "express";
import {
  viewProfileInfo,
  updateProfileInfo,
} from "../controllers/profileController.js";

const router = express.Router();

router.route("/info").get(viewProfileInfo).patch(updateProfileInfo);

export default router;
