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

const router = express.Router();

router.get("/all", getAllSurveys);
router.post("/create", createSurvey);
router
  .route("/:id")
  .get(getSurveyById)
  .patch(updateSurvey)
  .delete(deleteSurvey);
router.post("/add-response", addResponse);
router.post("/check-auth", checkAuth);

export default router;
