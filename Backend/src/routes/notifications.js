const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const filter = {
      $or: [
        { businessId: req.user._id },
        { creatorId: req.user._id },
      ],
    };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const response = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      campaignId: n.campaignId,
      createdAt: n.createdAt,
    }));

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/unread-count", protect, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      $or: [
        { businessId: req.user._id, read: false },
        { creatorId: req.user._id, read: false },
      ],
    });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

router.patch("/read-all", protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { businessId: req.user._id, read: false },
          { creatorId: req.user._id, read: false },
        ],
      },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", protect, async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    const ownerId = notification.businessId || notification.creatorId;
    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    notification.read = true;
    await notification.save();

    res.json({ id: notification._id, read: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
