const express = require("express");
const Campaign = require("../models/Campaign");
const Submission = require("../models/Submission");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const { protect, authorizeRoles } = require("../middleware/auth");
const { getCostPerView } = require("../config/pricing");
const { initializeTransaction, verifyTransaction } = require("../services/paystack");

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { businessId: req.user._id };

    if (status && status !== "all") {
      if (status === "review_needed") {
        filter.status = "live";
      } else {
        filter.status = status;
      }
    }

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 });

    const draftCount = await Campaign.countDocuments({
      businessId: req.user._id,
      status: "draft",
    });

    const campaignsResponse = campaigns.map((c) => {
      const progressPercent =
        c.targetViews > 0
          ? Math.min(Math.round((c.viewsDelivered / c.targetViews) * 100), 100)
          : 0;

      const deliveryDays =
        c.startDate && c.endDate
          ? Math.ceil((new Date(c.endDate) - new Date(c.startDate)) / (1000 * 60 * 60 * 24))
          : null;

      return {
        id: c._id,
        name: c.name,
        coverImageUrl: c.coverImageUrl,
        category: c.category,
        deliveryDays,
        status: c.status,
        reviewNeeded: c.status === "live" && c.viewsDelivered < c.targetViews,
        targetViews: c.targetViews,
        viewsDelivered: c.viewsDelivered,
        progressPercent,
      };
    });

    res.json({ campaigns: campaignsResponse, draftCount });
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorizeRoles("business"), async (req, res, next) => {
  try {
    const { coverImageUrl, name, category, startDate, endDate, targetViews } = req.body;

    const costPerView = getCostPerView(category);
    const budget = targetViews * costPerView;

    const campaign = await Campaign.create({
      businessId: req.user._id,
      coverImageUrl,
      name,
      category,
      startDate,
      endDate,
      targetViews,
      costPerView,
      budget,
    });

    res.status(201).json({
      id: campaign._id,
      status: campaign.status,
      budget: campaign.budget,
      costPerView: campaign.costPerView,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (campaign.status !== "draft") {
      return res.status(400).json({ error: "Can only edit draft campaigns" });
    }

    const allowedFields = [
      "contentBrief",
      "keyMessageCta",
      "whatToAvoid",
      "platforms",
      "contentStyle",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/save-and-close", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (campaign.status !== "draft") {
      return res.status(400).json({ error: "Can only save draft campaigns" });
    }

    const { step, data } = req.body;
    const updates = {};

    if (step === 1) {
      if (data.coverImageUrl !== undefined) updates.coverImageUrl = data.coverImageUrl;
      if (data.name !== undefined) updates.name = data.name;
      if (data.category !== undefined) updates.category = data.category;
      if (data.startDate !== undefined) updates.startDate = data.startDate;
      if (data.endDate !== undefined) updates.endDate = data.endDate;
      if (data.targetViews !== undefined) {
        updates.targetViews = data.targetViews;
        updates.costPerView = getCostPerView(data.category || campaign.category);
      }
    } else if (step === 2) {
      if (data.contentBrief !== undefined) updates.contentBrief = data.contentBrief;
      if (data.keyMessageCta !== undefined) updates.keyMessageCta = data.keyMessageCta;
      if (data.whatToAvoid !== undefined) updates.whatToAvoid = data.whatToAvoid;
      if (data.platforms !== undefined) updates.platforms = data.platforms;
      if (data.contentStyle !== undefined) updates.contentStyle = data.contentStyle;
    }

    const updated = await Campaign.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ id: updated._id, status: updated.status });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/review", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({
      id: campaign._id,
      name: campaign.name,
      targetViews: campaign.targetViews,
      budget: campaign.budget,
      platforms: campaign.platforms,
      contentBrief: campaign.contentBrief,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/launch", protect, async (req, res, next) => {
  try {
    const { paystackReference } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (campaign.status !== "draft") {
      return res.status(400).json({ error: "Can only launch draft campaigns" });
    }

    if (paystackReference) {
      const verification = await verifyTransaction(paystackReference);
      if (verification.status !== "success") {
        return res.status(400).json({ error: "Payment verification failed" });
      }
    }

    campaign.status = "under_review";
    await campaign.save();

    await Transaction.create({
      campaignId: campaign._id,
      type: "escrow_deposit",
      amount: campaign.budget,
      status: "escrow_deposit",
      date: new Date(),
    });

    await Notification.create({
      businessId: req.user._id,
      campaignId: campaign._id,
      type: "under_review",
      title: "Under review",
      body: "We're reviewing your campaign. It'll go live within 2 hours.",
    });

    res.json({
      id: campaign._id,
      status: campaign.status,
      message: "We're reviewing your campaign. It'll go live within 2 hours.",
      escrow: {
        totalEscrowed: campaign.budget,
        platformFee: campaign.platformFee,
        creatorPool: campaign.creatorPool,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/topup", protect, async (req, res, next) => {
  try {
    const { amount, paystackReference } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (paystackReference) {
      const verification = await verifyTransaction(paystackReference);
      if (verification.status !== "success") {
        return res.status(400).json({ error: "Payment verification failed" });
      }
    }

    campaign.targetViews += Math.round(amount / campaign.costPerView);
    await campaign.save();

    await Transaction.create({
      campaignId: campaign._id,
      type: "topup",
      amount,
      status: "escrow_deposit",
      date: new Date(),
    });

    res.json({
      budget: campaign.budget,
      creatorPool: campaign.creatorPool,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/extend-deadline", protect, async (req, res, next) => {
  try {
    const { newEndDate } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    campaign.endDate = newEndDate;
    await campaign.save();

    res.json({ endDate: campaign.endDate });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/pause", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (campaign.status !== "live") {
      return res.status(400).json({ error: "Can only pause live campaigns" });
    }

    campaign.status = "paused";
    await campaign.save();

    res.json({ id: campaign._id, status: campaign.status });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/resume", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (campaign.status !== "paused") {
      return res.status(400).json({ error: "Can only resume paused campaigns" });
    }

    campaign.status = "live";
    await campaign.save();

    res.json({ id: campaign._id, status: campaign.status });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/cancel", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (["completed", "cancelled"].includes(campaign.status)) {
      return res.status(400).json({ error: "Cannot cancel this campaign" });
    }

    campaign.status = "cancelled";
    await campaign.save();

    const unreleased = await Transaction.aggregate([
      { $match: { campaignId: campaign._id, status: "escrow_deposit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const refundAmount = unreleased.length > 0 ? unreleased[0].total : 0;
    if (refundAmount > 0) {
      await Transaction.create({
        campaignId: campaign._id,
        type: "refund",
        amount: refundAmount,
        status: "refunded",
        date: new Date(),
      });
    }

    res.json({ id: campaign._id, status: campaign.status });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const progressPercent =
      campaign.targetViews > 0
        ? Math.min(Math.round((campaign.viewsDelivered / campaign.targetViews) * 100), 100)
        : 0;

    const deliveryDays =
      campaign.startDate && campaign.endDate
        ? Math.ceil(
            (new Date(campaign.endDate) - new Date(campaign.startDate)) / (1000 * 60 * 60 * 24)
          )
        : null;

    const submissionsReceived = await Submission.countDocuments({
      campaignId: campaign._id,
    });
    const submissionsApproved = await Submission.countDocuments({
      campaignId: campaign._id,
      status: { $in: ["approved", "awaiting_post", "posted"] },
    });
    const submissionsAwaitingReview = await Submission.countDocuments({
      campaignId: campaign._id,
      status: "new",
    });

    res.json({
      id: campaign._id,
      name: campaign.name,
      category: campaign.category,
      deliveryDays,
      targetViews: campaign.targetViews,
      budget: campaign.budget,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      status: campaign.status,
      viewsDelivered: campaign.viewsDelivered,
      progressPercent,
      submissionsReceived,
      submissionsApproved,
      submissionsAwaitingReview,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
