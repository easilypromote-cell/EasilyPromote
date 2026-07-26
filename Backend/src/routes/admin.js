const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Submission = require("../models/Submission");
const { protect, authorizeRoles } = require("../middleware/auth");

const adminGuard = [protect, authorizeRoles("admin", "super_admin", "finance_admin", "support")];

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get("/stats", adminGuard, async (req, res, next) => {
  try {
    const [
      totalBrands,
      totalCreators,
      campaignsByStatus,
      totalEscrowed,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: "business" }),
      User.countDocuments({ role: "creator" }),
      Campaign.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Campaign.aggregate([
        { $match: { status: { $in: ["live", "under_review"] } } },
        { $group: { _id: null, total: { $sum: "$budget" } } },
      ]),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt isActive"),
    ]);

    const statusMap = {};
    campaignsByStatus.forEach(({ _id, count }) => { statusMap[_id] = count; });

    res.json({
      brands: totalBrands,
      creators: totalCreators,
      campaigns: {
        total: Object.values(statusMap).reduce((a, b) => a + b, 0),
        under_review: statusMap.under_review || 0,
        live: statusMap.live || 0,
        draft: statusMap.draft || 0,
        paused: statusMap.paused || 0,
        completed: statusMap.completed || 0,
        cancelled: statusMap.cancelled || 0,
        pending_payment: statusMap.pending_payment || 0,
      },
      totalEscrowed: totalEscrowed[0]?.total || 0,
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/campaigns ─────────────────────────────────────────────────
router.get("/campaigns", adminGuard, async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (q) filter.name = { $regex: q, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);
    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("businessId", "name email"),
      Campaign.countDocuments(filter),
    ]);

    res.json({
      campaigns: campaigns.map((c) => ({
        id: c._id,
        name: c.name,
        category: c.category,
        status: c.status,
        budget: c.budget,
        targetViews: c.targetViews,
        viewsDelivered: c.viewsDelivered,
        progressPercent: c.targetViews > 0
          ? Math.min(Math.round((c.viewsDelivered / c.targetViews) * 100), 100)
          : 0,
        coverImageUrl: c.coverImageUrl,
        contentBrief: c.contentBrief,
        platforms: c.platforms,
        createdAt: c.createdAt,
        brand: c.businessId
          ? { id: c.businessId._id, name: c.businessId.name, email: c.businessId.email }
          : null,
      })),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/campaigns/:id/status ────────────────────────────────────
router.patch("/campaigns/:id/status", adminGuard, async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowed = ["live", "paused", "cancelled", "under_review", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    campaign.status = status;
    if (note) campaign.adminNote = note;
    await campaign.save();

    res.json({ success: true, status: campaign.status });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get("/users", adminGuard, async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (role && role !== "all") filter.role = role;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select("-password"),
      User.countDocuments(filter),
    ]);

    // attach campaign / submission counts
    const userIds = users.map((u) => u._id);
    const [campaignCounts, submissionCounts] = await Promise.all([
      Campaign.aggregate([
        { $match: { businessId: { $in: userIds } } },
        { $group: { _id: "$businessId", count: { $sum: 1 } } },
      ]),
      Submission.aggregate([
        { $match: { creatorId: { $in: userIds } } },
        { $group: { _id: "$creatorId", count: { $sum: 1 } } },
      ]),
    ]);

    const campaignMap = {};
    campaignCounts.forEach(({ _id, count }) => { campaignMap[_id.toString()] = count; });
    const submissionMap = {};
    submissionCounts.forEach(({ _id, count }) => { submissionMap[_id.toString()] = count; });

    res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt,
        campaignCount: campaignMap[u._id.toString()] || 0,
        submissionCount: submissionMap[u._id.toString()] || 0,
      })),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/users/:id/status ───────────────────────────────────────
router.patch("/users/:id/status", adminGuard, async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = Boolean(isActive);
    await user.save();

    res.json({ success: true, isActive: user.isActive });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
