const express = require("express");
const Campaign = require("../models/Campaign");
const Slot = require("../models/Slot");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { status, businessId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (businessId) filter.businessId = businessId;

    const campaigns = await Campaign.find(filter)
      .populate("businessId", "name")
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "businessId",
      "name email"
    );
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

router.post("/", protect, authorizeRoles("business"), async (req, res, next) => {
  try {
    const campaign = await Campaign.create({
      businessId: req.user._id,
      ...req.body,
    });
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.businessId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    if (["funded", "live", "completed"].includes(campaign.status)) {
      return res.status(400).json({ error: "Cannot edit campaign in current status" });
    }

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/pause", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.status !== "live") {
      return res.status(400).json({ error: "Can only pause live campaigns" });
    }

    campaign.status = "closed";
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/resume", protect, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    if (campaign.status !== "closed") {
      return res.status(400).json({ error: "Can only resume closed campaigns" });
    }

    campaign.status = "live";
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
