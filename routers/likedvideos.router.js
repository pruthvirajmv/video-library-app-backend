const express = require("express");
const {
   checkAndGetUserLikedVideos,
   getUserLikedVideos,
   toggleLikedVideo,
} = require("../controllers/likedVideo.controller");
const router = express.Router();

router.use(checkAndGetUserLikedVideos);
router.route("/").get(getUserLikedVideos).post(toggleLikedVideo);

module.exports = router;
