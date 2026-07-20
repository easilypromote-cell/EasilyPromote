const express = require("express");
const Submission = require("../models/Submission");
const Campaign = require("../models/Campaign");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/campaign/:campaignId", protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { campaignId: req.params.campaignId };

    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (status) {
      filter.status = status;
    }

    const submissions = await Submission.find(filter).sort({ submittedAt: -1 });

    const counts = {
      new: await Submission.countDocuments({ campaignId: req.params.campaignId, status: "new" }),
      awaitingPost: await Submission.countDocuments({
        campaignId: req.params.campaignId,
        status: "awaiting_post",
      }),
      posted: await Submission.countDocuments({
        campaignId: req.params.campaignId,
        status: "posted",
      }),
      rejected: await Submission.countDocuments({
        campaignId: req.params.campaignId,
        status: "rejected",
      }),
    };

    const submissionsResponse = submissions.map((s) => ({
      id: s._id,
      creatorHandle: s.creatorHandle,
      videoUrl: s.videoUrl,
      caption: s.caption,
      durationSeconds: s.durationSeconds,
      uploadedAt: s.submittedAt,
      status: s.status,
    }));

    res.json({ counts, submissions: submissionsResponse });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/approve", protect, async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const campaign = await Campaign.findById(submission.campaignId);
    if (!campaign || campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (submission.status !== "new") {
      return res.status(400).json({ error: "Can only approve new submissions" });
    }

    submission.status = "awaiting_post";
    submission.reviewedAt = new Date();
    await submission.save();

    res.json({ id: submission._id, status: submission.status });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/reject", protect, async (req, res, next) => {
  try {
    const { reason } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const campaign = await Campaign.findById(submission.campaignId);
    if (!campaign || campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (submission.status !== "new") {
      return res.status(400).json({ error: "Can only reject new submissions" });
    }

    submission.status = "rejected";
    submission.rejectionReason = reason;
    submission.reviewedAt = new Date();
    await submission.save();

    await Notification.create({
      businessId: req.user._id,
      campaignId: submission.campaignId,
      type: "rejected",
      title: "Submission rejected",
      body: `Submission from ${submission.creatorHandle} was rejected.${reason ? ` Reason: ${reason}` : ""}`,
    });

    res.json({
      id: submission._id,
      status: submission.status,
      rejectionReason: submission.rejectionReason,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/mark-posted", protect, async (req, res, next) => {
  try {
    const { posts } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    if (submission.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (submission.status !== "awaiting_post") {
      return res.status(400).json({ error: "Submission must be awaiting_post before marking as posted" });
    }

    submission.status = "posted";
    submission.postedAt = new Date();
    submission.postedPlatforms = posts.map((p) => ({
      platform: p.platform,
      postUrl: p.postUrl,
      views: 0,
      likes: 0,
      comments: 0,
    }));
    await submission.save();

    const campaign = await Campaign.findById(submission.campaignId);
    if (campaign) {
      await Notification.create({
        businessId: campaign.businessId,
        campaignId: campaign._id,
        type: "submission_pending",
        title: "Content posted",
        body: `${submission.creatorHandle} has posted content for "${campaign.name}".`,
      });
    }

    res.json({ id: submission._id, status: submission.status });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/sync-stats", protect, async (req, res, next) => {
  try {
    const { platform, views, likes, comments } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    if (submission.status !== "posted") {
      return res.status(400).json({ error: "Can only sync stats for posted submissions" });
    }

    const platformEntry = submission.postedPlatforms.find((p) => p.platform === platform);
    if (platformEntry) {
      platformEntry.views = views || 0;
      platformEntry.likes = likes || 0;
      platformEntry.comments = comments || 0;
    } else {
      submission.postedPlatforms.push({ platform, postUrl: "", views: views || 0, likes: likes || 0, comments: comments || 0 });
    }

    submission.viewsDelivered = submission.postedPlatforms.reduce((sum, p) => sum + (p.views || 0), 0);
    await submission.save();

    const campaign = await Campaign.findById(submission.campaignId);
    if (campaign) {
      const totalViews = await Submission.aggregate([
        { $match: { campaignId: campaign._id, status: "posted" } },
        { $group: { _id: null, total: { $sum: "$viewsDelivered" } } },
      ]);
      campaign.viewsDelivered = totalViews.length > 0 ? totalViews[0].total : 0;

      if (campaign.viewsDelivered >= campaign.targetViews && campaign.status === "live") {
        campaign.status = "completed";
        await Notification.create({
          businessId: campaign.businessId,
          campaignId: campaign._id,
          type: "completed",
          title: "Completed",
          body: "Campaign hit its target — that's a wrap.",
        });
      }
      await campaign.save();
    }

    const creatorPoolShare = campaign ? campaign.creatorPool / Math.max(campaign.viewsDelivered, 1) : 0;
    const payoutAmount = Math.round(submission.viewsDelivered * creatorPoolShare);

    res.json({
      id: submission._id,
      viewsDelivered: submission.viewsDelivered,
      payoutAmount,
      payoutStatus: submission.payoutStatus,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
