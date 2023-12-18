import Video from "../models/youtube/Video.js";
import { errorResponse, successResponse } from "../utils/responses.js";

export const getAllVideos = async (req, res) => {
  try {
    const videos = await video.find().populate({
      path: "creator",
      select: "fullname username",
    });
    successResponse(res, 200, "All videos fetched successfully", { videos });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await video.findById(id).populate({
      path: "creator",
      select: "fullname username",
    });
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }
    successResponse(res, 200, "Video fetched successfully", { video });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const createVideo = async (req, res) => {
  try {
    const creatorId = req.session.userId;
    if (!creatorId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to create a Video!"
      );
    }
    const newVideo = await video.create({ ...req.body, creator: creatorId });
    successResponse(res, 201, "Video created successfully", { newVideo });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to update this video!"
      );
    }
    const videoToUpdate = await video.findById(id);
    if (!videoToUpdate) {
      return errorResponse(res, 404, "Video not found");
    }
    if (videoToUpdate.creator.toString() !== currentUserId) {
      return errorResponse(
        res,
        403,
        "User not authorized to update this video"
      );
    }
    const updatedVideo = await video.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    successResponse(res, 200, "Video updated successfully", { updatedVideo });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    if (!currentUserId) {
      return errorResponse(
        res,
        401,
        "User must be logged in to delete this Video!"
      );
    }
    const videoToDelete = await video.findById(id);
    if (!videoToDelete) {
      return errorResponse(res, 404, "Video not found");
    }
    if (videoToDelete.creator.toString() !== currentUserId) {
      return errorResponse(
        res,
        403,
        "User not authorized to delete this Video"
      );
    }
    const deletedVideo = await video.findByIdAndDelete(id);
    successResponse(
      res,
      200,
      `Video "${deletedVideo.title}" deleted successfully`
    );
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const addViewer = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const video = await Video.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!video) {
      return errorResponse(res, 404, "Video not found");
    }
    video.viewersId.push(currentUserId);
    await video.save();
    successResponse(res, 200, "User added to Video viewers successfully");
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

export const checkAuth = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.session.userId;
    const video = await Video.findById(id);
    if (!currentUserId) {
      return errorResponse(res, 401, "User must be logged in!");
    }
    if (!video) {
      return errorResponse(res, 404, "video not found");
    }
    if (video.viewersId.includes(currentUserId)) {
      return successResponse(res, 200, "User already watched this video", {
        watched: true,
      });
    }
    successResponse(res, 200, "User has not watched this video yet", {
      watched: false,
    });
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
