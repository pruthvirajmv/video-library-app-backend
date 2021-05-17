const express = require('express');
const { checkUserHistory, getUserHistory, addVideoToHistory, removeVideoFromHistory, clearUserHistory } = require('../controllers/history.controller');
const router = express.Router();

router.param("userId",checkUserHistory)

router.route('/:userId')
.get(getUserHistory)
.post(addVideoToHistory)

router.route('/:userId/remove')
.post(removeVideoFromHistory)

router.route('/:userId/clear')
.get(clearUserHistory)

module.exports = router;