import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../services/ApiError.js";
import { ApiResponse } from "../services/ApiResponse.js";
import { asyncHandler } from "../services/asyncHandler.js";
 
//---------------------Toggle Subscription--------------------
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  // Check if channelId is valid
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid or missing channelId..!");
  }

  // Check if user is authenticated
  if (!userId) {
    throw new ApiError(401, "User not authenticated..!");
  }

  try {
    // Check if user already subscribed to the channel
    const subscription = await Subscription.findOne({
      subscriberId: userId,
      channelId: channelId,
    });

    if (subscription) {
      // Unsubscribe
      await subscription.deleteOne(subscription._id)
      return res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully!"));
    } else {
      // Subscribe
      await Subscription.create({
        subscriberId: userId,
        channelId: channelId,
        subscriberName: req.user.userName,
      });
      return res.status(200).json(new ApiResponse(200, "Subscribed successfully!"));
    }

  } catch (error) {
    throw new ApiError(500, "Internal server error: " + error.message);
  }
  
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { 
  toggleSubscription, 
  getUserChannelSubscribers, 
  getSubscribedChannels 
};
