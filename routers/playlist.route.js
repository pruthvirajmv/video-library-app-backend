const express = require('express');
const {
  checkAndGetUserPlaylist,
  getUserPlaylist,
  createNewPlaylist,
  toggleVideoInPlaylist,
  editPlaylistName,
  removePlaylist,
} = require('../controllers/playlist.controller');

const router = express.Router();

router.param('userId', checkAndGetUserPlaylist);

router.route('/:userId')
  .get(getUserPlaylist).post(createNewPlaylist);

router.route('/:userId/togglevideo')
  .post(toggleVideoInPlaylist);

router.route('/:userId/rename')
  .post(editPlaylistName);

router.route('/:userId/remove').post(removePlaylist);

module.exports = router;