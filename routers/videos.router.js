const express = require('express');
var router = express.Router();

const { getVideosFromDb, addVideoToDb } = require('../controllers/video.controller');

router.route("/")
.get(getVideosFromDb)
.post(addVideoToDb)

module.exports = router;