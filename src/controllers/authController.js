import User from "../models/User.js";
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
    successResponse(res, 201, `User '${user.username}' signed up successfully.`)
  } catch (error) {
    //  errorResponse(res, 500, "Error while signing up");
    errorResponse(res, 500, error.message)
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
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
      req.session.userID = existingUser._id;
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


export const logout =  async (req, res) => {
  try {
    const { userID } = req.session;
    if (userID) {
      const user = await User.findById(userID);
      req.session.destroy();
      return successResponse(
        res,
        200,
        `User '${user.username}' logged out successfully`
      );
    } else {
      return errorResponse(res, 401, `You are not logged in.`);
    }
  } catch (error) {
    errorResponse(res, 500, "Error while logging out");
  }
};