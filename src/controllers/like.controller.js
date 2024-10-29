import { Like } from "../models/like.model.js";
import { asyncHandler } from "../services/asyncHandler.js";
import { ApiError } from "../services/ApiError.js";
import { ApiResponse } from "../services/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"


//----------------------Videos Liked---------------------
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || !userId) {
    throw new ApiError(400, "Invalid user or video id");
  }
  // Find the video by videoId
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  try {
    const like = await Like.findOne({
      video: videoId,
      owner: userId,
    });
    //console.log("like:" + like);

    if (like) {
      await Like.findByIdAndDelete(like._id);
      //video.likes.pull(like._id);
      //await video.save();
      return res.status(200).json(new ApiResponse(200, null, "Video unliked"));

    } else {
      const liked = await Like.create({
        video: videoId,
        owner: userId,
      });
      await liked.save();
      //video.likes.push(like._id);
      //await video.save();
      return res.status(200).json(new ApiResponse(200, liked, "Video liked"));
    }

  } catch (error) {
    throw new ApiError(500, "Internal server error" + error.message);
  }
})

//----------------------Comment Liked--------------------
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !userId) {
    throw new ApiError(400, "Invalid user or comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  try {
    const like = await Like.findOne({
      comment: commentId,
      owner: userId,
    });

    if (like) {
      await Like.findByIdAndDelete(like._id);
      await comment.save();
      return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));

    } else {
      const liked = await Like.create({
        comment: commentId,
        owner: userId,
      });
      await liked.save();
      return res.status(200).json(new ApiResponse(200, liked, "Comment liked"));
    }

  } catch (error) {
    throw new ApiError(500, "Internal server error" + error.message);
  }
})

//----------------------Tweet Liked----------------------
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!tweetId || !userId) {
    throw new ApiError(400, "Invalid user or tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, "Tweet not found");
  }

  try {
    const like = await Like.findOne({
      tweet: tweetId,
      owner: userId,
    });
    if (like) {
      await Like.findByIdAndDelete(like._id);
      await tweet.save();
      return res.status(200).json(new ApiResponse(200, null, "Tweet unliked"));

    } else {
      const liked = await Like.create({
        tweet: tweetId,
        owner: userId,
      });
      await liked.save();
      //await tweet.save();
      return res.status(200).json(new ApiResponse(200, liked, "Tweet liked"));
    }

  } catch (error) {
    throw new ApiError(500, "Internal server error" + error.message);
  }
})

//----------------------Get Liked Videos-----------------
const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }
  const likes = await Like.find({ owner: userId }).populate("video");
  return res.status(200).json(new ApiResponse(200, likes, "Liked videos"));
  
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos 
};
