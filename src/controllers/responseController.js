import Survey from "../models/survey/Survey.js";
import Question from "../models/survey/Question.js";
import Response from "../models/survey/Response.js";
import { errorResponse, successResponse } from "../utils/responses.js";

const validateAnswers = async (surveyId, providedAnswers) => {
  try {
    const survey = await Survey.findById(surveyId).populate("questions");

    if (!survey) {
      return null;
    }

    const validAnswers = [];

    for (const providedAnswer of providedAnswers) {
      const question = survey.questions.find((q) =>
        q._id.equals(providedAnswer.questionId)
      );

      if (!question) {
        return null;
      }

      validAnswers.push({
        questionId: question._id,
        answer: providedAnswer.answer,
      });
    }

    return validAnswers;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addResponse = async (req, res) => {
  try {
    const { surveyId, answers } = req.body;
    const userId = req.session.userId;
    const survey = await Survey.findById(surveyId);

    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    if (!survey) {
      return errorResponse(res, 404, `Survey with ${surveyId} not found`);
    }

    // Validate the provided answers
    const validAnswers = await validateAnswers(surveyId, answers);
    if (!validAnswers) {
      return errorResponse(res, 400, "Invalid answers provided.");
    }

    // Save the response
    const response = await Response.create({
      surveyId,
      userId,
      answers: validAnswers,
    });

    successResponse(res, 201, "Response added successfully", { response });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
