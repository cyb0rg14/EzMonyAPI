import cron from "cron";
import { errorResponse, successResponse } from "../../utils/responses.js";
import User from "../../models/user/User.js";
// import { userValidation } from "./helperCode.js";

export const addEarnings = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.session.userId;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $inc: {
        "earnings.today": amount,
        "earnings.weekly": amount,
        "earnings.monthly": amount,
        "earnings.yearly": amount,
        "earnings.total": amount,
      },
    });
    successResponse(res, 200, "Earnings added successfully", {
      earinings: updatedUser.earnings,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const resetDailyEarnings = async () => {
  try {
    await User.updateMany({}, { $set: { "earnings.today": 0 } });
    successResponse(res, 200, "Daily earnings reset successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const resetWeeklyEarnings = async () => {
  try {
    await User.updateMany({}, { $set: { "earnings.weekly": 0 } });
    successResponse(res, 200, "Weekly earnings reset successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const resetMonthlyEarnings = async () => {
  try {
    await User.updateMany({}, { $set: { "earnings.monthly": 0 } });
    successResponse(res, 200, "Monthly earnings reset successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

const resetYearlyEarnings = async () => {
  try {
    await User.updateMany({}, { $set: { "earnings.yearly": 0 } });
    successResponse(res, 200, "Yearly earnings reset successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Schedule the function to run daily at midnight IST
const resetDailyEarningsJob = new cron.CronJob(
  "0 0 * * *",
  resetDailyEarnings,
  null,
  true,
  "Asia/Kolkata"
);
resetDailyEarningsJob.start();

// Schedule the function to run every Monday at midnight IST
const resetWeeklyEarningsJob = new cron.CronJob(
  "0 0 * * 1",
  resetWeeklyEarnings,
  null,
  true,
  "Asia/Kolkata"
);
resetWeeklyEarningsJob.start();

// Schedule the function to run on the first day of every month at midnight IST
const resetMonthlyEarningsJob = new cron.CronJob(
  "0 0 1 1 *",
  resetMonthlyEarnings,
  null,
  true,
  "Asia/Kolkata"
);
resetMonthlyEarningsJob.start();

// Schedule the function to run on the first day of every year at midnight IST
const resetYearlyEarningsJob = new cron.CronJob(
  "0 0 1 1 *",
  resetYearlyEarnings,
  null,
  true,
  "Asia/Kolkata"
);
resetYearlyEarningsJob.start();
