import { errorResponse } from "../../utils/responses.js";
import User from "../../models/user/User.js";

export const userValidation = async (res, userId) => {
  if (!userId) {
    return errorResponse(res, 401, "User not yet logged in!");
  }
  const user = await User.findById(userId);
  if (!user) {
    return errorResponse(res, 404, `User with ${userId} not found`);
  }
  return user;
};
