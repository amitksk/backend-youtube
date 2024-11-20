import {asyncHandler} from "../services/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../services/ApiError.js"
import { ApiResponse } from "../services/ApiResponse.js"


//-------------------Create Tweet-------------------
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    const userId = req.user._id;
     
    if(!content){
        throw new ApiError(400, "Tweet is required")
    }
    if(!userId) {
        throw new ApiError(400, "Invalid user ID")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user.userName
    })

    return res 
    .status(201)
    .json(new ApiResponse(201, { tweet }, "Tweet created successfully"));
})

//-------------------Get User Tweets----------------
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id
    
    if(!userId) {
        throw new ApiError(400, "Invalid user ID")
    }
    
    const tweets = await Tweet.find({ owner: userId })
    
    if(!tweets) {
        throw new ApiError(404, "No tweets found for this user");
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
})

//-------------------Update Tweet-------------------
const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    if(!content){
        throw new ApiError(400, "Tweet is required")
    }
    if(!userId) {
        throw new ApiError(400, "Invalid user ID")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId, 
        { 
            content: content 
        }, 
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, { tweet }, "Tweet updated successfully"));
})

//-------------------Delete Tweet-------------------
const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    const userId = req.user._id;
    
    if (!tweetId) {
        throw new ApiError(400, "Invalid tweet id");
    }
    if(!userId) {
        throw new ApiError(400, "Invalid User")
    }
    
    const tweet = await Tweet.findByIdAndDelete(tweetId);
    
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}