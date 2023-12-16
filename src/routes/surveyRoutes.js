import express from "express";
import { addResponse } from "../controllers/responseController.js";
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  checkAuth,
} from "../controllers/surveyController.js";
import {
  makePayment,
  calculatePaymentForSurveys,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/all", getAllSurveys);
router.post("/create", createSurvey);
router.post("/add-response", addResponse);
router.post("/check-auth", checkAuth);
router.post("/make-payment", makePayment);
router.post("/calculate-payment", calculatePaymentForSurveys);
router
  .route("/:id")
  .get(getSurveyById)
  .patch(updateSurvey)
  .delete(deleteSurvey);

export default router;
