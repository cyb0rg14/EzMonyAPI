import Survey from "../../models/survey/Survey.js";
import Response from "../../models/survey/Response.js";
import { errorResponse, successResponse } from "../../utils/responses.js";


const validateAnswers = async (res, surveyId, answers) => {
  const survey = await Survey.findById(surveyId).populate("questions");

  // Check if all questions have been answered
  const surveyQuestionIds = survey.questions.map(q => q._id.toString());
  const answeredQuestionIds = answers.map(a => a.questionId.toString());
  if (!surveyQuestionIds.every(id => answeredQuestionIds.includes(id))) {
    return errorResponse(res, 400, "All questions must be answered");
  }

  // Check if all answers are valid
  for (const answer of answers) {
    const question = survey.questions.find(q => q._id.toString() === answer.questionId.toString());
    if (question.type === 'multiple-choice' && !question.options.includes(answer.answer)) {
      return errorResponse(res, 400, "Invalid answers provided");
    }
  }

  return answers;
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

    // Validate the answers
    const validAnswers = await validateAnswers(res, surveyId, answers);
    if (!validAnswers) {
      return;
    }

    // Create a new response
    const response = await Response.create({
      surveyId,
      userId,
      answers: validAnswers,
    });

    // Add user to responders
    survey.respondersId.push(userId);
    await survey.save();

    successResponse(res, 201, "Response added successfully", { response });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};