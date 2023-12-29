import express from "express";
import {
  makePayment,
  calculatePaymentForAds,
} from "../controllers/paymentController.js";
import {
  getAllAds,
  getRecommendedAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  checkAuth,
  addViewer,
} from "../controllers/adController.js";

const router = express.Router();

router.get("/all", getAllAds);
router.get("/recommended", getRecommendedAds);
router.post("/create", createAd);
router.post("/check-auth", checkAuth);
router.post("/add-viewer", addViewer);
router.post("/make-payment", makePayment);
router.post("/calculate-payment", calculatePaymentForAds);
router.route("/:id").get(getAdById).patch(updateAd).delete(deleteAd);

export default router;
 