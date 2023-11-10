import express from "express";
import {
  viewProfileInfo,
  updateProfileInfo,
  changePassword,
  deleteProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.route("/info").get(viewProfileInfo).patch(updateProfileInfo);
router.patch("/changePassword", changePassword);
router.delete("/delete", deleteProfile);

export default router;
