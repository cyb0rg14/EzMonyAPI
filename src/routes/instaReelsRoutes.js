import express from "express";
import {
  getAllReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
} from "../controllers/instaReelsController.js";

const router = express.Router();

router.get("/all", getAllReels);
router.post("/create", createReel);
router.route("/:id").get(getReelById).patch(updateReel).delete(deleteReel);

export default router;
