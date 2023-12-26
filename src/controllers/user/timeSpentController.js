import cron from "cron";
import User from "../../models/user/User.js";
import { successResponse, errorResponse } from "../../utils/responses.js";

export const addTimeSpent = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.session.userId;
    if (!userId) {
      return errorResponse(res, 401, "User not yet logged in!");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $inc: {
        "timeSpent.today": amount,
        "timeSpent.weekly": amount,
        "timeSpent.monthly": amount,
        "timeSpent.yearly": amount,
        "timeSpent.total": amount,
      },
    });
    successResponse(res, 200, "Time spent added successfully", {
      timeSpent: updatedUser.timeSpent,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const resetDailyTimeSpent = async () => {
  try {
    await User.updateMany({}, { $set: { "timeSpent.today": 0 } });
    console.log("Daily Time Spent successfully");
  } catch (error) {
    console.error(error.message);
  }
};

export const resetWeeklyTimeSpent = async () => {
  try {
    await User.updateMany({}, { $set: { "timeSpent.weekly": 0 } });
    console.log("Weekly time spent successfully");
  } catch (error) {
    console.error(error.message);
  }
};

export const resetMonthlyTimeSpent = async () => {
  try {
    await User.updateMany({}, { $set: { "timeSpent.monthly": 0 } });
    console.log("Monthly time spent successfully");
  } catch (error) {
    console.error(error.message);
  }
};

export const resetYearlyTimeSpent = async () => {
  try {
    await User.updateMany({}, { $set: { "timeSpent.yearly": 0 } });
    console.log("Yearly time spent successfully");
  } catch (error) {
    console.error(error.message);
  }
};

// Schedule the function to run daily at midnight IST
const resetDailyTimeSpentJob = new cron.CronJob(
  "0 0 * * *",
  resetDailyTimeSpent,
  null,
  true,
  "Asia/Kolkata"
);
resetDailyTimeSpentJob.start();

// Schedule the function to run every Monday at midnight IST
const resetWeeklyTimeSpentJob = new cron.CronJob(
  "0 0 * * 1",
  resetWeeklyTimeSpent,
  null,
  true,
  "Asia/Kolkata"
);
resetWeeklyTimeSpentJob.start();

// Schedule the function to run on the first day of every month at midnight IST
const resetMonthlyTimeSpentJob = new cron.CronJob(
  "0 0 1 1 *",
  resetMonthlyTimeSpent,
  null,
  true,
  "Asia/Kolkata"
);
resetMonthlyTimeSpentJob.start();

// Schedule the function to run on the first day of every year at midnight IST
const resetYearlyTimeSpentJob = new cron.CronJob(
  "0 0 1 1 *",
  resetYearlyTimeSpent,
  null,
  true,
  "Asia/Kolkata"
);
resetYearlyTimeSpentJob.start();
