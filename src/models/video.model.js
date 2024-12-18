import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
    },
    title:{
      type: String,
      required: true
    },
    description:{
      type: String,
      required: true
    },
    duration:{
      type: Number,
      
    },
    views:{
      type: Number,
      default: 0
    },
    isPublished:{
      type: Boolean,
      default: true
    },
    owner:{
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    channelId :{
      type: Schema.Types.ObjectId,
      ref: "Channel"
    },
  }, {timestamps: true}

)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);
