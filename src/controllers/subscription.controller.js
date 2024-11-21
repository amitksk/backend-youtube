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

//---------------------Get Channel Subscriber-----------------
const getChannelSubscriber = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  
  if (!channelId) {
    throw new ApiError(400, "Invalid or missing channel id");
  }
  try {
    const subscribers = await Subscription.find({ channelId: channelId });
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully!"));
    
  } catch (error) {
    throw new ApiError(500, "Internal server error: " + error.message);
  }

});


//---------------------Get Channel Subscribers List-----------
const getChannelSubscribersList = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid or missing channel id"));
  }

  try {
    // Fetch subscriptions for the given channelId
    const subscriptions = await Subscription.find({ channelId })
      .populate("subscriberId", "userName email")
      .exec();

    if (!subscriptions.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No subscribers found for this channel"));
    }

    // Format response data
    const subscribers = subscriptions.map((sub) => ({
      id: sub.subscriberId?._id,
      userName: sub.subscriberId?.userName,
      email: sub.subscriberId?.email,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully!"));

  } catch (error) {
    //console.error("Error fetching subscribers:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
});


//controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});


export { 
  toggleSubscription,
  getChannelSubscriber,
  getChannelSubscribersList,
  getSubscribedChannels 
}
