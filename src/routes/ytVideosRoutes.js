import express from "express";
import {
  makepayment,
  calculatePaymentForVideos,
} from "../controllers/paymentController.js";
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  addViewer,
  checkAuth,
} from "../controllers/ytVideosController.js";

const router = express.Router();

router.get("/all", getAllVideos);
router.post("/create", createVideo);
router.post("/add-viewer", addViewer);
router.post("/check-auth", checkAuth);
router.post("/make-payment", makepayment);
router.post("/calculate-payment", calculatePaymentForVideos);
router.route("/:id").get(getVideoById).patch(updateVideo).delete(deleteVideo);

export default router;
