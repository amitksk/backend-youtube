import mongoose, {Schema} from "mongoose";

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String
        },
        logo: {
            type: String
        },
        banner: {
            type: String
        },
        subscriberTo: {
            type: Number,
            default: 0
        },
        subscribers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video'
            }
        ]
    }, {}
)

export const Channel = mongoose.model("Channel", channelSchema)