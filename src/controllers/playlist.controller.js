import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../services/ApiError.js";
import { ApiResponse } from "../services/ApiResponse.js";
import { asyncHandler } from "../services/asyncHandler.js";
import { Video } from "../models/video.model.js";

// --------------------create playlist--------------------
const createPlaylist = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user._id;

  if (!title) {
    throw new ApiError(400, "Title cannot be empty");
  }
  if (!user) {
    throw new ApiError(400, "User is not logged in");
  }
  // Create a new playlist
  const playlist = new Playlist({
    title,
    description,
    owner: user,
    videos: [],
  });

  await playlist.save();

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

//---------------------Add videos to playlist-------------
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  try {
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid playlist ID or video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }

    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    // Check if the video is already in the playlist
    if (playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video is already in the playlist");
    }

    // Add the video to the playlist
    playlist.videos.push(videoId);
    await playlist.save();

    // Return updated playlist
    return res.status(200).json({
      message: "Video added to playlist successfully",
      playlist,
    });
  } catch (error) {
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

//---------------------Get user's All playlists-----------
const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //console.log("userId: " + userId)
  //TODO: get user playlists

  if (!userId) {
    throw new ApiError(400, "Invalid user ID");
  }

  const playlists = await Playlist.find({ owner: userId });

  if (!playlists) {
    throw new ApiError(404, "No playlists found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlists, "User's playlists fetched successfully")
    );
});

//---------------------Get Playlist By Id-----------------
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id

  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid or missing playlist id");
  }
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

//---------------------Remove Video From Playlist---------
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid or missing playlist id");
  }
  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video id");
  }
  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video is not in the playlist");
  }
  playlist.videos = playlist.videos.filter((vid) => vid.toString() !== videoId);
  await playlist.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { playlist },
        "Video removed from playlist successfully"
      )
    );
});

//---------------------Delete Playlist--------------------
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid or missing playlist id");
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, "Playlist deleted successfully"));
});

//---------------------Update Playlist--------------------
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { title, description } = req.body;
  //TODO: update playlist
  if (!playlistId || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid or missing playlist id");
  }
  if (!title || !description) {
    throw new ApiError(400, "Title or description is required");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: { title, description },
    },
    {
      new: true,
    }
  )

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
})

export {
  createPlaylist,
  addVideoToPlaylist,
  getUserPlaylists,
  getPlaylistById,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
