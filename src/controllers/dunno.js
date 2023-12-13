import { errorResponse, successResponse } from "../utils/responses.js";

const checkPageVisit = async (req, res) => {
  const pageId = req.params.pageId;
  const userId = req.session.userId;
  try {
    const page = await Page.findOne({ _id: pageId });
    if (!page) {
      return errorResponse(res, 404, "Page not found");
    }
    if (!userId) {
      return errorResponse(res, 401, "User not logged in");
    }
    if (!page.visitors.includes(userId)) {
      page.visitors.push(userId);
      await page.save();
    }
    successResponse(res, 200, "Page visited successfully", { page });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
