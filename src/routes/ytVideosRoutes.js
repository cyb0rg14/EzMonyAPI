import express from "express";
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/ytVideosController.js";

const router = express.Router();

router.get("/all", getAllVideos);
router.post("/create", createVideo);
router.route("/:id").get(getVideoById).patch(updateVideo).delete(deleteVideo);

export default router;
