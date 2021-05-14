const express = require('express');
const { checkUserLikedVideos, getUserLikedVideos, toggleLikedVideo } = require('../controllers/likedVideo.controller');
const router = express.Router();

router.param("userId",checkUserLikedVideos)
router.route('/:userId')
.get(getUserLikedVideos)
.post(toggleLikedVideo)

module.exports = router;