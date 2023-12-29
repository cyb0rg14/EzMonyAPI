import express from "express";
import {
  makePayment,
  calculatePaymentForReels,
} from "../controllers/paymentController.js";
import {
  getAllReels,
  getRecommendedReels,
  getReelById,
  createReel,
  updateReel,
  deleteReel,
  addViewer,
  checkAuth,
} from "../controllers/reelController.js";

const router = express.Router();

router.get("/all", getAllReels);
router.get("/recommended", getRecommendedReels);
router.post("/create", createReel);
router.post("/add-viewer", addViewer);
router.post("/check-auth", checkAuth);
router.post("/make-payment", makePayment);
router.post("/calculate-payment", calculatePaymentForReels);
router.route("/:id").get(getReelById).patch(updateReel).delete(deleteReel);

export default router;
