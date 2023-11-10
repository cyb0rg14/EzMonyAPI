import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/responses.js";

export const viewProfileInfo = async (req, res) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, `User with ${userId} not found`);
    }
    successResponse(
      res,
      200,
      `User '${user.username}' profile info fetched successfully`,
      { user: user }
    );
  } catch (error) {
    errorResponse(res, 500, "Error while fetching profile info");
  }
};

export const updateProfileInfo = async (req, res) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, `User with ${userId} not found`);
    }
    const updatedData = req.body;
    if ("password" in updatedData) {
      return errorResponse(
        res,
        400,
        `Password cannot be updated through this endpoint`
      );
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });
    successResponse(
      res,
      200,
      `User '${updatedUser.username}' profile info updated successfully`,
      { user: updatedUser }
    );
  } catch (error) {
    errorResponse(res, 500, "Error while updating profile info");
  }
};

export const changePassword = async (req, res) => {
  try {
    
  } catch (error) {
    errorResponse(res, 500, "Error while changing password");
  }
}