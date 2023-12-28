import Survey from "../../models/survey/Survey.js";
import Question from "../../models/survey/Question.js";
import { errorResponse, successResponse } from "../../utils/responses.js";

export const getAllSurveys = async (req, res) => {
  try {
    const { pageSize = 4, categories, subCategories } = req.query;
    const query = {};
    if (categories) {
      if (!Array.isArray(categories)) {
        query.categories = categories;
      } else if (categories.length > 0) {
        query.categories = { $all: categories };
      }
    }
    if (subCategories) {
      if (!Array.isArray(subCategories)) {
        query.subCategories = subCategories;
      } else if (subCategories.length > 0) {
        query.subCategories = { $all: subCategories };
      }
    }
    const surveys = await Survey.find(query)
      .populate({
        path: "questions",
        select: "text type options",
      })
      .populate({
        path: "creator",
        select: "fullname username",
      })
      .sort({ _id: -1 })
      .limit(pageSize);

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
    const creatorId = req.session.userId;
    const createdQuestions = [];
    const {
      title,
      description,
      images,
      startDate,
      endDate,
      noOfResponses,
      questions,
    } = req.body;
    // if (!creatorId) {
    //   return errorResponse(
    //     res,
    //     401,
    //     "User must be logged in to create a Survey!"
    //   );
    // }
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
      images,
      startDate,
      endDate,
      noOfResponses,
      questions: createdQuestions.map((question) => question._id),
      creator: creatorId,
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

    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to update this survey!"
      );
    }

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
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to delete this survey!"
      );
    }
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
    await Survey.findByIdAndDelete(id);

    successResponse(
      res,
      200,
      `Survey "${existingSurvey.title}" deleted successfully`
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const checkAuth = async (req, res) => {
  const surveyId = req.body.surveyId;
  const userId = req.session.userId;
  try {
    const survey = await Survey.findOne({ _id: surveyId });
    if (!survey) {
      return errorResponse(res, 404, "Survey not found");
    }
    if (!userId) {
      return errorResponse(res, 401, "User not logged in");
    }
    if (!survey.respondersId.includes(userId)) {
      return successResponse(res, 200, "Survey not filled yet", {
        responded: false,
      });
    }
    successResponse(res, 200, "Survey has already been filled", {
      responded: true,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
