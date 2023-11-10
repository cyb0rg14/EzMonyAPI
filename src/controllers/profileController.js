import User from "../models/User.js";
import bcrypt from "bcryptjs";
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
    const sanitizedUser = { ...user._doc };
    delete sanitizedUser.password;
    delete sanitizedUser.upiId;
    successResponse(
      res,
      200,
      `User '${user.username}' profile info fetched successfully`,
      { user: sanitizedUser }
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
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
    errorResponse(res, 500, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, `User with ${userId} not found`);
    }
    const { oldPassword, newPassword, securityKey } = req.body;
    if (!newPassword) {
      return errorResponse(res, 400, "Send all required fields: New Password")
    }
    if (!securityKey && oldPassword) {
      const passwordMatch = await user.comparePassword(oldPassword);
      if (!passwordMatch) {
        return errorResponse(res, 401, "Incorrect Password!");
      }
      if (oldPassword === newPassword) {
        return errorResponse(
          res,
          400,
          "New password cannot be same as old password"
        );
      }
    } else if (!oldPassword && securityKey) {
      if (securityKey !== user.password) {
        return errorResponse(res, 401, "Incorrect Security Key!");
      }
    } else if (!oldPassword && !securityKey) {
      return errorResponse(
        res,
        400,
        "Send all required fields: Old Password or Security Key"
      );
    }
    const genSalt = await bcrypt.genSalt(10);
    const bcryptedPassword = await bcrypt.hash(newPassword, genSalt);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: bcryptedPassword },
      { new: true }
    );
    successResponse(
      res,
      200,
      `User '${updatedUser.username}' password changed successfully`,
      { newSecurityKey: bcryptedPassword }
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, `User with ${userId} not found`);
    }
    const { password, securityKey } = req.body;
    if (!securityKey && !password) {
      return errorResponse(
        res,
        400,
        "Send all required fields: Old Password or Security Key"
      );
    } else if (!securityKey && password) {
      const passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) {
        return errorResponse(res, 401, "Incorrect Password!");
      }
    } else if (!password && securityKey) {
      if (securityKey !== user.password) {
        return errorResponse(res, 401, "Incorrect Security Key!");
      }
    } else {
      return errorResponse(
        res,
        400,
        "Only require one field: Old Password or Security Key"
      );
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    successResponse(
      res,
      200,
      `User '${deletedUser.username}' deleted successfully`,
      { deletedUser }
    )
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
}