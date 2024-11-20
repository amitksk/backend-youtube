import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {

        subscriberId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        channelId: {
            type: Schema.Types.ObjectId,
            ref: "Channel"
        },
        subscriberName: {
            type: String,
            required: true
        }
    }, {timestamps: true}
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)
