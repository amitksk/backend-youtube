import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../services/ApiError.js";
import { ApiResponse } from "../services/ApiResponse.js";
import { asyncHandler } from "../services/asyncHandler.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";
import { Channel } from "../models/channel.model.js";

//----------------------Create Channel--------------------
const createChannel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user._id;
  
  if (!name) {
    throw new ApiError(400, "Channel name are required");
  }
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }
  
  const logoLocalPath = await req.files?.logo[0]?.path;
  const bannerLocalPath = await req.files?.banner[0]?.path;

  if (!logoLocalPath) {
    throw new ApiError(400, "Channel logo is required");
  }

  const logo = await uploadOnCloudinary(logoLocalPath);
  const banner = await uploadOnCloudinary(bannerLocalPath);

  if (!logo || !logo.url) {
    throw new ApiError(400, "Logo image file is missing...");
  }

  const existingChannel = await Channel.findOne({ name: name });
  if (existingChannel) {
    throw new ApiError(400, "Channel with this name already exists");
  } else {
    const channel = await Channel.create({
      name: name,
      email: req.user?.email,
      description: description,
      logo: logo.url,
      banner: banner?.url || "",
      owner:  userId,
      ownerName: req.user?.userName
    });

    return res
      .status(201)
      .json(new ApiResponse(200, channel, "Channel create successfully"));
  }
});

//----------------------get channel stats-----------------
const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Validate channelId
  if (!isValidObjectId(channelId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid or missing channel id"));
  }

  try {
    // Debugging: Check if the channelId is valid in the database
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json(new ApiResponse(404, null, "Channel not found"));
    }

    // 1. Total Video Views
    const videoViews = await Video.aggregate([
      { $match: { channelId: new mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    console.log("videoViews:", videoViews); // Debugging log

    // 2. Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({ channelId: new mongoose.Types.ObjectId(channelId) });

    // 3. Total Videos
    const totalVideos = await Video.countDocuments({ channelId: new mongoose.Types.ObjectId(channelId) });

    // 4. Total Likes (if your Video schema includes a likes field)
    const videoLikes = await Video.aggregate([
      { $match: { channelId: new mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
    ]);
    console.log("videoLikes:", videoLikes); // Debugging log

    // Prepare the stats response
    const stats = {
      totalViews: videoViews[0]?.totalViews || 0, // If no videos, set to 0
      totalSubscribers,
      totalVideos,
      totalLikes: videoLikes[0]?.totalLikes || 0, // If no videos, set to 0
    };

    return res
      .status(200)
      .json(new ApiResponse(200, stats, "Channel stats fetched successfully!"));
  } catch (error) {
    console.error("Error fetching channel stats:", error); // Log the error
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});

//----------------------get channel videos----------------
const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
  const userId = req.user._id;
  if (!channelId ||!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel id");
  }
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }
  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  const videos = await Video.find({ channel: channelId }).sort({
    createdAt: -1,
  });
  return res
   .status(200)
   .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
   
});

//---------------------Delete Channel---------------------
const deleteChannel = asyncHandler(async (req, res) => {
  // TODO: delete channel and all its associated data
  const { channelId } = req.params;
  const userId = req.user._id;
  if (!channelId ||!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channel id");
  }
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }
  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }
  if (channel.owner.toString()!== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this channel");
  }
  await channel.remove();
  return res
  .status(200)
  .json(new ApiResponse(200, null, "Channel deleted successfully"));

});


export {
  createChannel,
  //deleteChannel,
  //updateChannel,
  //getUserChannel,
  getChannelStats,
  getChannelVideos,
};
