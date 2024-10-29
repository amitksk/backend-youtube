import {Comment} from "../models/comment.model.js"
import {asyncHandler} from "../services/asyncHandler.js"
import {ApiError} from "../services/ApiError.js"
import {ApiResponse} from "../services/ApiResponse.js"
import {Video} from "../models/video.model.js"


//-------------------Get Video Comments--------------
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId ||!videoId) {
        throw new ApiError(400, "Invalid or missing video id");
    }
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        const comments = await Comment.find({videoId})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
        
        return res
        .status(200)
        .json(new ApiResponse(200, comments, "Fatched user comments successfully"))
        
        
    } catch (error) {
        throw new ApiError(500, "Internal server error" + error.message)
    }
})

//--------------------Add Comment---------------------
const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body;
    const userId = req.user._id;

    if (!videoId) {
        throw new ApiError(400, "Invalid video id provided")
    }
    if(!content){
        throw new ApiError(400, "Comment is required")
    }
    
    try {
        const comment = Comment.create({
            comment: content || [],
            owner: userId,
            videoId: videoId,
        })
    
        //await comment.save()

        return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
    
    } catch (error) {
        throw new ApiError(500, "Internal server error" + error.message)
    }
    
})

//--------------------Update Comment------------------
const updateComment = asyncHandler(async (req, res) => {
     
    const { videoId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    //console.log("videoId: " + videoId)
    //console.log("commentId: " + commentId)
    //console.log("content: " + content)

    if (!videoId ||!commentId) {
        throw new ApiError(400, "Invalid video or comment ID");
    }
    if (!content) {
        throw new ApiError(400, "Comment is required");
    }

    try {
        // Find the comment by videoId, userId, and commentId
        let userComment = await Comment.findOne({
            _id: commentId, 
            videoId: videoId, 
            owner: userId
        })

        //console.log("userComment:" + userComment)

        if (!userComment) {
            throw new ApiError(400, "You don't have permission to edit" + error.message)
            
        }

        // Update the comment's content
        userComment.comment = content;

        // Save the updated comment
        await userComment.save();

        return res
        .status(200)
        .json(new ApiResponse(200, userComment, "Comment updated successfully"));
        
    } catch (error) {
        throw new ApiError(500, "Internal server error: " + error.message);
    }
})

//--------------------Delete a comment-----------------
const deleteComment = asyncHandler(async (req, res) => {
    const { videoId, commentId } = req.params;
    const userId = req.user._id;

    if (!videoId || !commentId) {
        throw new ApiError(400, "Invalid video or comment ID");
    }

    try {
        // Find the comment by commentId, videoId, and owner (userId)
        const userComment = await Comment.findOneAndDelete({
            _id: commentId,
            videoId: videoId,
            owner: userId,
        });

        if (!userComment) {
            throw new ApiError(400, "Comment not found or you don't have permission to delete it");
        }

        return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Internal server error: " + error.message);
    }
});

//--------------------Like/Unlike Comment--------------
const likeComment = asyncHandler(async (req, res) => {
    const { videoId, commentId } = req.params;
    const userId = req.user._id;

    if (!videoId ||!commentId) {
        throw new ApiError(400, "Invalid video or comment ID");
    }

    try {
        // Find the comment by commentId, videoId, and owner (userId)
        let userComment = await Comment.findOne({
            _id: commentId,
            videoId: videoId,
            owner: userId,
        });

        if (!userComment) {
            throw new ApiError(400, "Comment not found or you don't have permission to like it");
        }

        // Toggle the like status
        userComment.likes = userComment.likes.includes(userId)? userComment.likes.filter(like => like!== userId) : [...userComment.likes, userId];

        // Save the
        await userComment.save();
        
        return res.status(200).json(new ApiResponse(200, userComment, "Like/Unlike status updated successfully"));
        
    } catch (error) {
        throw new ApiError(500, "Internal server error: " + error.message);
    }

});


export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}