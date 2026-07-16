const express = require("express");
const CreatorProfile = require("../models/CreatorProfile");

const router = express.Router();

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
