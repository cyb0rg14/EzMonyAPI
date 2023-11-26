import User from "../models/user/User.js";
import { successResponse, errorResponse } from "../utils/responses.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, password } = req.body;
    if (!fullname || !username || !password) {
      return errorResponse(
        res,
        400,
        "Send all required fields: fullname, username, and password"
      );
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return errorResponse(res, 409, `Username '${username}' is not available`);
    }
    const user = await User.create({ fullname, username, password });
    successResponse(
      res,
      201,
      `User '${user.username}' signed up successfully.`,
      { securityKey: user.password }
    );
  } catch (error) {
    errorResponse(res, 500, "Error while signing up");
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (req.session.userId) {
      return errorResponse(res, 409, "Already logged in!");
    }
    if (!username || !password) {
      return errorResponse(
        res,
        400,
        "Send all required fields: Username, and Password"
      );
    }
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return errorResponse(res, 404, `User '${username}' not found!`);
    }
    const passwordMatch = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      return errorResponse(res, 401, "Incorrect Password!");
    }
    if (existingUser) {
      req.session.userId = existingUser._id;
      req.session.authorized = true;
    }
    return successResponse(
      res,
      200,
      `User '${existingUser.username}' logged in successfully`
    );
  } catch (error) {
    errorResponse(res, 500, "Error while logging in");
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.session;
    if (userId) {
      const user = await User.findById(userId);
      req.session.destroy();
      return successResponse(
        res,
        200,
        `User '${user.username}' logged out successfully`
      );
    } else {
      return errorResponse(res, 401, `User not yet logged in`);
    }
  } catch (error) {
    errorResponse(res, 500, "Error while logging out");
  }
};

export const checkSecurityKey = async (req, res) => {
  try {
    const { username, securityKey } = req.body;
    if (!username || !securityKey) {
      return errorResponse(
        res,
        400,
        "Send all required fields: Username and Security Key"
      );
    }
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return errorResponse(res, 404, `User '${username}' not found!`);
    }
    if (existingUser.password !== securityKey) {
      return errorResponse(res, 401, "Incorrect Security Key!");
    } else {
      return successResponse(
        res,
        200,
        `Security Key for user '${existingUser.username}' is correct`
      );
    }
  } catch (error) {
    errorResponse(res, 500, "Error while checking security key");
  }
};