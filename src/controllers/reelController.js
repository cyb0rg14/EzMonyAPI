import User from "../models/user/User.js";
import Reel from "../models/instagram/Reel.js";
import { getMatchingScores } from "../utils/recalgo.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllReels = async (req, res) => {
  try {
    const { pageSize = 8, categories, subCategories } = req.query;
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
    const reels = await Reel.find(query)
      .populate({
        path: "creator",
        select: "fullname username",
      })
      .sort({ _id: -1 })
      .limit(pageSize);

    successResponse(res, 200, "All reels fetched successfully", { reels });
  } catch (error) {
    errorResponse(res, 500, error.message); 
  }
};

export const getRecommendedReels = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to get recommended reels!"
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const reels = await Reel.find();
    const reelMatchingScores = await getMatchingScores(user, reels, "reel");
    reels.sort((a, b) => {
      const scoreA =
        reelMatchingScores.find((item) => item.reelId.equals(a._id))?.score || 0;
      const scoreB =
        reelMatchingScores.find((item) => item.reelId.equals(b._id))?.score || 0;
      return scoreB - scoreA;
    });

    successResponse(res, 200, "Reels fetched successfully", { reels });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
}

export const getReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await Reel.findById(id).populate({
      path: "creator",
      select: "fullname username",
    });
    if (!reel) {
      return errorResponse(res, 404, "Reel not found");
    }
    successResponse(res, 200, "Reel fetched successfully", { reel });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const createReel = async (req, res) => {
  try {
    const creatorId = req.session.userId;
    // if (!creatorId) {
    //   return errorResponse(
    //     res,
    //     401,
    //     "User must be logged in to create a Reel!"
    //   );
    // }
    const newReel = await Reel.create({ ...req.body, creator: creatorId });
    successResponse(res, 201, "Reel created successfully", { newReel });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to update this Reel!"
      );
    }
    const updatedReel = await Reel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedReel) {
      return errorResponse(res, 404, "Reel not found");
    }
    if (updatedReel.creator.toString() !== currentUserId) {
      return errorResponse(res, 403, "User not authorized to update this Reel");
    }
    successResponse(res, 200, "Reel updated successfully", { updatedReel });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to delete this Reel!"
      );
    }
    const reelToDelete = await Reel.findById(id);
    if (!reelToDelete) {
      return errorResponse(res, 404, "Reel not found");
    }
    if (reelToDelete.creator.toString() !== currentUserId) {
      return errorResponse(res, 403, "User not authorized to delete this Reel");
    }
    const deletedReel = await Reel.findByIdAndDelete(id);
    successResponse(
      res,
      200,
      `Reel "${deletedReel.title}" deleted successfully`
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const addViewer = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const reel = await Reel.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!reel) {
      return errorResponse(res, 404, "Reel not found");
    }
    reel.viewersId.push(currentUserId);
    await reel.save();
    successResponse(res, 200, "User reelded to Reel viewers successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const reel = await Reel.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!reel) {
      return errorResponse(res, 404, "Reel not found");
    }
    if (reel.viewersId.includes(currentUserId)) {
      return successResponse(res, 200, "User alrereely watched this Reel", {
        watched: true,
      });
    }
    successResponse(res, 200, "User has not watched this Reel yet", {
      watched: false,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
