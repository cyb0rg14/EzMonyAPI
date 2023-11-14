import Survey from "../models/survey/Survey.js";
import Question from "../models/survey/Question.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find()
      .populate({
        path: "questions",
        select: "text type options",
      })
      .populate({
        path: "creator",
        select: "fullname username",
      });
    successResponse(res, 200, "All surveys fetched successfully", { surveys });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findById(id)
      .populate({
        path: "questions",
        select: "text type options",
      })
      .populate({
        path: "creator",
        select: "fullname username",
      });

    if (!survey) {
      return errorResponse(res, 404, "Survey not found");
    }

    successResponse(res, 200, "Survey fetched successfully", { survey });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const createSurvey = async (req, res) => {
  try {
    const {
      title,
      description,
      picture,
      duration,
      reward,
      startDate,
      endDate,
      questions,
    } = req.body;
    const creator = req.session.userId;

    const createdQuestions = [];

    for (const questionData of questions) {
      const question = new Question({
        text: questionData.text,
        type: questionData.type,
        options: questionData.options || [],
      });

      createdQuestions.push(question);
    }

    const newSurvey = new Survey({
      title,
      description,
      picture,
      duration,
      reward,
      startDate,
      endDate,
      questions: createdQuestions.map((question) => question._id),
      creator,
    });

    for (const question of createdQuestions) {
      question.survey = newSurvey._id;
      await question.save();
    }

    const savedSurvey = await newSurvey.save();
    successResponse(res, 201, "Survey created successfully", {
      survey: savedSurvey,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByIdAndUpdate(id, req.body, { new: true });
    successResponse(res, 200, "Survey updated successfully", {
      updatedSurey: survey,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await Survey.findByIdAndDelete(id);
    successResponse(res, 204, `Survey ${survey.title} deleted successfully`);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
