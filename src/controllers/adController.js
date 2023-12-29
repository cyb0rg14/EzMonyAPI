import Ad from "../models/ad/Ad.js";
import User from "../models/user/User.js";
import { getMatchingScores } from "../utils/recalgo.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllAds = async (req, res) => {
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
    const ads = await Ad.find(query)
      .populate({
        path: "creator",
        select: "fullname username",
      })
      .sort({ _id: -1 })
      .limit(pageSize);

    successResponse(res, 200, "Ads fetched successfully", { ads });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getRecommendedAds = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to get recommended Ads!"
      );
    }
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const ads = await Ad.find();
    const adMatchingScores = await getMatchingScores(user, ads, "ad");
    ads.sort((a, b) => {
      const scoreA =
        adMatchingScores.find((item) => item.adId.equals(a._id))?.score || 0;
      const scoreB =
        adMatchingScores.find((item) => item.adId.equals(b._id))?.score || 0;
      return scoreB - scoreA;
    });

    successResponse(res, 200, "Ads fetched successfully", { ads });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id).populate({
      path: "creator",
      select: "fullname username",
    });
    if (!ad) {
      return errorResponse(res, 404, "Ad not found");
    }
    successResponse(res, 200, "Ad fetched successfully", { ad });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const createAd = async (req, res) => {
  try {
    const creatorId = req.session.userId;
    // if (!creatorId) {
    //   return errorResponse(res, 401, "User must be logged in to create an Ad!");
    // }
    const newAd = await Ad.create({ ...req.body, creator: creatorId });
    successResponse(res, 201, "Ad created successfully", { newAd });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to update this Ad!"
      );
    }
    const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAd) {
      return errorResponse(res, 404, "Ad not found");
    }
    if (updatedAd.creator.toString() !== currentUserId) {
      return errorResponse(res, 403, "User not authorized to update this Ad");
    }
    successResponse(res, 200, "Ad updated successfully", { updatedAd });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to delete this Ad!"
      );
    }
    const adToDelete = await Ad.findById(id);
    if (!adToDelete) {
      return errorResponse(res, 404, "Ad not found");
    }
    if (adToDelete.creator.toString() !== currentUserId) {
      return errorResponse(res, 403, "User not authorized to delete this Ad");
    }
    const deletedAd = await Ad.findByIdAndDelete(id);
    successResponse(res, 200, `Ad "${deletedAd.title}" deleted successfully`);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const ad = await Ad.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!ad) {
      return errorResponse(res, 404, "Ad not found");
    }
    if (ad.viewersId.includes(currentUserId)) {
      return successResponse(res, 200, "User already watched this Ad", {
        watched: true,
      });
    }
    successResponse(res, 200, "User has not watched this Ad yet", {
      watched: false,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const addViewer = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const ad = await Ad.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!ad) {
      return errorResponse(res, 404, "Ad not found");
    }
    ad.viewersId.push(currentUserId);
    await ad.save();
    successResponse(res, 200, "User added to Ad viewers successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
