const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");

router.post("/create", passport.authenticate("user"), async (req, res) => {
  const { name, thumbnail, track } = req.body;
  if (!name || !thumbnail || !track) {
    return res.status(301).json({ error: "insufficient details provided" });
  }
  const artist = req.user._id;
  const songDetails = { name, thumbnail, track, artist };
  const createdSong = await Song.create(songDetails);
  return res.status(200).json(createdSong);
});

module.exports = router;
