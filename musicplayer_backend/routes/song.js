const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { name, thumbnail, track } = req.body;
      if (!name || !thumbnail || !track) {
        return res.status(400).json({ error: "Insufficient details provided" });
      }

      const artist = req.user._id;
      const songDetails = { name, thumbnail, track, artist };
      const createdSong = await Song.create(songDetails);
      return res.status(201).json(createdSong);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const currentUser = req.user;
      const songs = await Song.find({ artist: currentUser._id });
      return res.json({ data: songs });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// get song by artist

router.get(
  "/get/artist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.body;
    const artist = await User.find({ _id: artistid });
    if (!artist) {
      return res.status(301).json({ error: "Artist does not exist" });
    }
    const songs = await Song.find({ artist: artistId });
    return res.json({ data: songs });
  }
);

// get song by song name
router.get(
  "get/songname",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.body;
    const songs = await Song.find({ name: songName });
    return res.json({ data: songs });
  }
);

module.exports = router;
