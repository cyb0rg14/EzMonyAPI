import exress from "express";
import { makePayment } from "../controllers/paymentController.js";

const router = exress.Router();

router.post("/make-payment", makePayment);

export default router;