import Ad from "../models/Ad.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    successResponse(res, 200, "Ads fetched successfully", { ads });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getAdById = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Ad.findById(id);
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
    const creator = req.session.userId;
    if (!creator) {
      return errorResponse(res, 401, "User not yet logged in!");
    }

    const newAd = await Ad.create({ ...req.body, creator });
    successResponse(res, 201, "Ad created successfully", { newAd });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedAd) {
      return errorResponse(res, 404, "Ad not found");
    }
    successResponse(res, 200, "Ad updated successfully", { updatedAd });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAd = await Ad.findByIdAndDelete(id);
    if (!deletedAd) {
      return errorResponse(res, 404, "Ad not found");
    }
    successResponse(res, 200, "Ad deleted successfully", { deletedAd });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
