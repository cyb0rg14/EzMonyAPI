import express from "express";
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "../controllers/surveyController.js";

const router = express.Router();

router.get("/", getAllSurveys);
router.post("/create", createSurvey);
router
  .route("/:id")
  .get(getSurveyById)
  .patch(updateSurvey)
  .delete(deleteSurvey);

export default router;
