import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../services/asyncHandler.js";
import { ApiError } from "../services/ApiError.js";
import { ApiResponse } from "../services/ApiResponse.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";

// //---------------------video uploads-----------------------
const PublishAvideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const userId = req.user?._id;
  //const videoId = req.params.id;

  if (!title || !description) {
    throw new ApiError(400, "title or description is required");
  }

  const videoFileLocalPath = await req.files?.videoFile[0]?.path;

  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = await req.files?.thumbnail[0]?.path;
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile.url) {
    throw new ApiError(500, "Failed to upload video file");
  }

  // uploadVideoFields.views += 1;

  // await video.save();

  const video = await Video.create({
    title,
    description,
    duration: videoFile?.duration,
    owner: userId,
    videoFile: videoFile.url,
    thumbnail: thumbnail?.url || "",
  });

  const uploadVideoFields = await Video.findById(video._id);

  if (!uploadVideoFields) {
    throw new ApiError(500, "something went wrong uploading video");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, "video, title, thumbnail uploaded Successfully")
    );
});

// //---------------------get all videos----------------------
const getAllvideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  // Convert page and limit to integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Define sorting order (1 for ascending, -1 for descending)
  const sortOrder = -1;

  const filter = {};
  //console.log("filter = " + filter);

  // Add search filter for video title or description
  // if (query) {
  //   filter.$or = [
  //     { title: { $regex: query, $options: 'i' } },
  //     { description: { $regex: query, $options: 'i' } }
  //   ];
  // }

  // Add user filter (if userId is provided)
  // if (userId) {
  //   filter.userId = userId;
  // }

  try {
    // Get the total count of videos that match the filter
    const videoCount = await Video.countDocuments(filter);
    console.log("videoCount = " + videoCount);

    // Calculate total pages
    const totalPages = Math.ceil(videoCount / limitNumber);
    console.log("totalPages = " + totalPages);

    // Fetch videos from the database with filtering, sorting, and pagination
    const videos = await Video.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      totalVideos: videoCount,
      totalPages,
      currentPage: pageNumber,
      videos,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error fetching videos",
      });
  }
});

// //---------------------get video from Id-------------------
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video id");
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      return new ApiError(400, "Video not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, { video }, "video fetched successfully"));
  } catch (error) {
    return new ApiError(500, "server Error");
  }
});

// //---------------------update video from Id----------------
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid or missing videoId");
  }

  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    // update video details
    const { title, description } = req.body;

    if (!title && !description) {
      throw new ApiError(400, "title and description are required");
    }
    if (title) video.title = title;
    if (description) video.description = description;

    const thumbnailLocalPath = await req.file?.path;

    if (!thumbnailLocalPath) {
      throw new ApiError(400, "thumbnail file is required");
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail || !thumbnail.url)
      throw new ApiError(400, "thumbnail file is missing..!");

    video.thumbnail = thumbnail.url;

    const updatedVideo = await video.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          updatedVideo,
        },
        "upload and updated Successfully"
      )
    );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error.message || "Error upload thumnail");
  }
});

// //---------------------deleat video from Id----------------
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(400, "Invalid or missing videoId..!");
  }

  const video = await Video.findByIdAndDelete(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video deleted successfully"));
});

// //---------------------toggle status------------------------
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Invalid or missing videoId..!");
  }
  try {
    const video = await Video.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found..!");
    }

    // Toggle the published status
    video.published = !video.published;

    // Save the updated video
    await video.save();

    return res
    .status(200)
    .json(
      new ApiResponse(200, {
        message: "Video publish status updated successfully",
        video: {
          id: video._id,
          published: video.published,
        },
      })
    )

  }catch (error) {
    throw new ApiError(500, {message: "Server error", error });
  }
});

export {
  PublishAvideo, 
  getAllvideos, 
  getVideoById, 
  updateVideo, 
  deleteVideo,
  togglePublishStatus
}
