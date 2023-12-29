import express from "express";
import {
  makePayment,
  calculatePaymentForVideos,
} from "../controllers/paymentController.js";
import {
  getAllVideos,
  getRecommendedVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addViewer,
  checkAuth,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/all", getAllVideos);
router.get("/recommended", getRecommendedVideos);
router.post("/create", createVideo);
router.post("/add-viewer", addViewer);
router.post("/check-auth", checkAuth);
router.post("/make-payment", makePayment);
router.post("/calculate-payment", calculatePaymentForVideos);
router.route("/:id").get(getVideoById).patch(updateVideo).delete(deleteVideo);

export default router;
