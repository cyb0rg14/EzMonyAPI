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
router.get("/:id", getSurveyById);
router.post("/create", createSurvey);
router.patch("/update/:id", updateSurvey);
router.delete("/delete/:id", deleteSurvey);

export default router;
