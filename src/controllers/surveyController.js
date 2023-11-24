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

    if (!creator) {
      return errorResponse(res, 401, "User not yet logged in!");
    }

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
    const { questions, ...updatedAttrs } = req.body;

    // Retrieve the existing survey
    const existingSurvey = await Survey.findById(id).populate("questions");
    if (!existingSurvey) {
      return errorResponse(res, 404, "Survey not found");
    }

    if (existingSurvey.creator.toString() !== req.session.userId) {
      return errorResponse(
        res,
        401,
        "User not authorized to update this survey"
      );
    }

    // Update the questions
    questions.forEach(async (updatedQuestion) => {
      const existingQuestion = existingSurvey.questions.find(
        (q) => q._id.toString() === updatedQuestion._id
      );

      if (existingQuestion) {
        existingQuestion.text = updatedQuestion.text;
        existingQuestion.type = updatedQuestion.type;
        existingQuestion.options = updatedQuestion.options || [];
        await existingQuestion.save();
      }
    });

    // Save the updated survey
    Object.keys(updatedAttrs).forEach((attr) => {
      if (existingSurvey[attr] !== undefined) {
        existingSurvey[attr] = updatedAttrs[attr];
      }
    });

    const updatedSurvey = await existingSurvey.save();
    successResponse(res, 200, "Survey updated successfully", {
      updatedSurvey,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSurvey = await Survey.findById(id);

    if (!existingSurvey) {
      return errorResponse(res, 404, "Survey not found");
    }

    if (existingSurvey.creator.toString() !== req.session.userId) {
      return errorResponse(
        res,
        403,
        "User not authorized to delete this survey"
      );
    }

    // Delete associated questions
    await Question.deleteMany({ _id: { $in: existingSurvey.questions } });

    // Delete the survey
    await existingSurvey.remove();

    successResponse(
      res,
      200,
      `Survey "${existingSurvey.title}" deleted successfully`
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};