import exress from "express";
import {
  makePayment,
  calculatePaymentForSurveys,
} from "../controllers/paymentController.js";

const router = exress.Router();

router.post("/make-payment", makePayment);
router.post("/calculate-payment", calculatePaymentForSurveys);

export default router;
