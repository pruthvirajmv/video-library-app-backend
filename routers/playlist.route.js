const express = require("express");
const {
   checkAndGetUserPlaylist,
   getUserPlaylist,
   createNewPlaylist,
   toggleVideoInPlaylist,
   editPlaylistName,
   removePlaylist,
} = require("../controllers/playlist.controller");

const router = express.Router();

router.use(checkAndGetUserPlaylist);

router.route("/").get(getUserPlaylist).post(createNewPlaylist);

router.route("/togglevideo").post(toggleVideoInPlaylist);

router.route("/rename").post(editPlaylistName);

router.route("/remove").post(removePlaylist);

module.exports = router;
