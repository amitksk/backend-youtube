import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure the subscriber field is always populated
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    subscriberName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes for performance
subscriptionSchema.index({ channelId: 1 });
subscriptionSchema.index({ subscriberId: 1 });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
