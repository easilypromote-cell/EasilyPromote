const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    brief: {
      type: String,
      maxlength: 2000,
    },
    category: {
      type: String,
      trim: true,
    },
    cover: {
      type: String,
      default: null,
    },
    targetViews: {
      type: Number,
      required: [true, "Target views is required"],
      min: 1,
    },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: 0,
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    creatorPool: {
      type: Number,
      default: 0,
    },
    creatorRankRequired: {
      type: String,
      enum: ["rank1", "rank2", "rank3", "rank4", "rank5", "elite", null],
      default: null,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_funding",
        "funded",
        "published",
        "live",
        "completed",
        "closed",
        "archived",
      ],
      default: "draft",
    },
    escrowStatus: {
      type: String,
      enum: ["none", "deposited", "locked", "released", "refunded"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
