const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ businessId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const response = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
    }));

    res.json(response);
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
    if (notification.businessId.toString() !== req.user._id.toString()) {
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
