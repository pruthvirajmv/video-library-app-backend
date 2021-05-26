const express = require('express');
const {
    checkAndGetUserLikedVideos,
    getUserLikedVideos,
    toggleLikedVideo,
} = require('../controllers/likedVideo.controller');
const router = express.Router();

router.param('userId', checkAndGetUserLikedVideos);
router.route('/:userId')
    .get(getUserLikedVideos)
    .post(toggleLikedVideo);

module.exports = router;