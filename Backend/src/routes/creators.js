const express = require("express");
const { z } = require("zod");
const CreatorProfile = require("../models/CreatorProfile");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Slot = require("../models/Slot");
const Submission = require("../models/Submission");
const Transaction = require("../models/Transaction");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/profile/me", protect, async (req, res, next) => {
  try {
    const profile = await CreatorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Creator profile not found" });
    }

    const user = await User.findById(req.user._id);

    res.json({
      name: user.name,
      avatar: user.avatar || null,
      displayName: profile.displayName || user.name,
      username: profile.username,
      bio: profile.bio || "",
      country: profile.country || "",
      socialAccounts: profile.socialAccounts || [],
      niches: profile.niches || [],
      rank: profile.rank,
      creatorScore: profile.creatorScore,
      lifetimeEarnings: profile.lifetimeEarnings,
      completionRate: profile.completionRate,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/profile/socials", protect, async (req, res, next) => {
  try {
    const { platform, handle } = req.body;

    if (!platform || !handle) {
      return res.status(400).json({ error: "Platform and handle are required" });
    }

    const profile = await CreatorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Creator profile not found" });
    }

    const existing = profile.socialAccounts.find(
      (s) => s.platform === platform.toLowerCase()
    );
    if (existing) {
      existing.handle = handle;
      existing.verified = false;
    } else {
      profile.socialAccounts.push({
        platform: platform.toLowerCase(),
        handle,
        verified: false,
      });
    }

    await profile.save();

    res.json({
      socialAccounts: profile.socialAccounts,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/profile/niches", protect, async (req, res, next) => {
  try {
    const { niches } = req.body;

    if (!Array.isArray(niches)) {
      return res.status(400).json({ error: "Niches must be an array" });
    }

    const profile = await CreatorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Creator profile not found" });
    }

    profile.niches = niches;
    await profile.save();

    res.json({
      niches: profile.niches,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/profile/me", protect, async (req, res, next) => {
  try {
    const { displayName, bio, country, avatar } = req.body;

    const profile = await CreatorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: "Creator profile not found" });
    }

    if (displayName !== undefined) profile.displayName = displayName;
    if (bio !== undefined) profile.bio = bio;
    if (country !== undefined) profile.country = country;

    await profile.save();

    const userUpdates = {};
    if (displayName !== undefined) userUpdates.name = displayName;
    if (avatar !== undefined) userUpdates.avatar = avatar;
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    res.json({
      displayName: profile.displayName,
      bio: profile.bio,
      country: profile.country,
      avatar: avatar !== undefined ? avatar : undefined,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const creators = await CreatorProfile.find().populate("userId", "name email");
    res.json(creators);
  } catch (error) {
    next(error);
  }
});

router.get("/leaderboard", async (req, res, next) => {
  try {
    const leaderboard = await CreatorProfile.find()
      .sort({ creatorScore: -1 })
      .limit(50)
      .populate("userId", "name");
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

router.get("/marketplace", protect, authorizeRoles("creator"), async (req, res, next) => {
  try {
    const profile = await CreatorProfile.findOne({ userId: req.user._id });
    const creatorRank = profile ? profile.rank : "rank1";

    const activeSlots = await Slot.countDocuments({
      creatorId: req.user._id,
      status: { $in: ["claimed", "submitted", "verifying"] },
    });

    const maxSlots = 3;
    const canClaim = activeSlots < maxSlots;

    const campaigns = await Campaign.find({
      status: "live",
    }).sort({ createdAt: -1 });

    const marketplace = [];

    for (const campaign of campaigns) {
      const availableSlots = await Slot.find({
        campaignId: campaign._id,
        status: "available",
      }).sort({ createdAt: -1 });

      if (availableSlots.length > 0) {
        const matchingSlot = availableSlots.find(
          (s) => !s.rankRequired || s.rankRequired === creatorRank
        ) || availableSlots[0];

        marketplace.push({
          id: campaign._id,
          title: campaign.name,
          category: campaign.category,
          reward: matchingSlot.reward,
          viewTarget: matchingSlot.viewTarget,
          slotId: matchingSlot._id,
          rankRequired: matchingSlot.rankRequired,
          slotsLeft: availableSlots.length,
          targetViews: campaign.targetViews,
          coverImageUrl: campaign.coverImageUrl,
          contentBrief: campaign.contentBrief,
          keyMessageCta: campaign.keyMessageCta,
          platforms: campaign.platforms,
        });
      }
    }

    res.json({
      campaigns: marketplace,
      activeSlots,
      maxSlots,
      canClaim,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/slots/mine", protect, authorizeRoles("creator"), async (req, res, next) => {
  try {
    const slots = await Slot.find({ creatorId: req.user._id })
      .populate({
        path: "campaignId",
        select: "name category status coverImageUrl contentBrief keyMessageCta whatToAvoid platforms contentStyle startDate endDate targetViews viewsDelivered",
      })
      .sort({ createdAt: -1 });

    const submissions = await Submission.find({
      creatorId: req.user._id,
    }).sort({ createdAt: -1 });

    const submissionMap = {};
    for (const sub of submissions) {
      submissionMap[sub.campaignId.toString()] = sub;
    }

    const campaigns = slots
      .filter((slot) => slot.campaignId)
      .map((slot) => {
        const campaign = slot.campaignId;
        const submission = submissionMap[campaign._id.toString()];

        let status;
        if (submission) {
          switch (submission.status) {
            case "new":
              status = "under_review";
              break;
            case "awaiting_post":
              status = "approved_post";
              break;
            case "posted":
              if (submission.viewsDelivered >= campaign.targetViews) {
                status = "delivered";
              } else {
                status = "live_tracking";
              }
              break;
            case "rejected":
              status = "changes_requested";
              break;
            default:
              status = "under_review";
          }
        } else {
          status = "needs_content";
        }

        return {
          id: campaign._id,
          slotId: slot._id,
          title: campaign.name,
          category: campaign.category,
          coverImageUrl: campaign.coverImageUrl,
          status,
          reward: slot.reward,
          viewTarget: slot.viewTarget,
          submissionId: submission ? submission._id : null,
          comment: submission && submission.status === "rejected" ? submission.rejectionReason : undefined,
          progress: submission && submission.viewsDelivered > 0
            ? Math.min(Math.round((submission.viewsDelivered / campaign.targetViews) * 100), 100)
            : undefined,
          currentViews: submission ? submission.viewsDelivered : undefined,
          targetViews: campaign.targetViews,
          videoUrl: submission ? submission.videoUrl : undefined,
          postedPlatforms: submission ? submission.postedPlatforms : undefined,
          contentBrief: campaign.contentBrief,
          keyMessageCta: campaign.keyMessageCta,
          whatToAvoid: campaign.whatToAvoid,
          platforms: campaign.platforms,
          contentStyle: campaign.contentStyle,
          delivery: slot.status === "claimed"
            ? "Claimed"
            : submission && submission.status === "posted"
            ? "Live"
            : submission && submission.status === "awaiting_post"
            ? "Awaiting Post"
            : "Submitted",
          submittedAgo: submission ? submission.submittedAt : undefined,
        };
      });

    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
});

router.get("/wallet", protect, authorizeRoles("creator"), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const profile = await CreatorProfile.findOne({ userId: req.user._id });

    const transactions = await Transaction.find({
      creatorHandle: { $ne: null },
    })
      .sort({ date: -1 })
      .limit(50);

    const myTransactions = await Submission.find({
      creatorId: req.user._id,
      payoutStatus: "released",
    });

    const totalReleased = myTransactions.reduce((sum, s) => sum + (s.payoutAmount || 0), 0);

    res.json({
      balance: user.walletBalance,
      lifetimeEarnings: profile ? profile.lifetimeEarnings : 0,
      completionRate: profile ? profile.completionRate : 0,
      totalReleased,
      recentTransactions: transactions.map((t) => ({
        date: t.date,
        amount: t.amount,
        type: t.type,
        status: t.status,
        views: t.views,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const creator = await CreatorProfile.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!creator) {
      return res.status(404).json({ error: "Creator profile not found" });
    }
    res.json(creator);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
