const express = require("express");
const router = express.Router();
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");
// route 1 create a playlist

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
      return res.status(301).json({ error: "Insufficient data" });
    }
    const playlistData = {
      name,
      thumbnail,
      songs,
      owner: currentUser._id,
      collaborators: [],
    };
    const playlist = await Playlist.create(playlistData);
    return res.json(playlist);
  }
);

router.get(
  "/get/playlist/:playlistid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const playlistId = req.params.playlistid;
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(301).json({ error: "invalid id" });
    }
    return res.json(playlist);
  }
);

module.exports = router;

// get all playlist made by an artist
router.get(
  "/get/artist/:artistid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const artistId = req.params.artistid;
    const user = await User.findOne({ _id: artistId });
    if (!user) {
      return res.status(304).json({ error: "invalid artist id" });
    }
    const playlists = await Playlist.find({ owner: artistId });
    return res.json({ data: playlists });
  }
);

// add a song to a playlist

router.post(
  "/add/song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(304).json({ error: "Playlist does not exist" });
    }
    if (
      playlist.owner != currentUser._id &&
      !playlist.collaborators.includes(currentUser._id)
    ) {
      return res.status(400).json({ error: "Not Allowed" });
    }
    const song = await Song.findOne({ _id: songId });
    if (!song) {
      return res.status(304).json({ error: "song does not exist" });
    }
    // now we can add the song to the playlist
    playlist.songs.push(songId);
    await playlist.save();
    return res.json(playlist);
  }
);
