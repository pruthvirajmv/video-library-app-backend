const { Video } = require('../models/video.model');

const getVideosFromDb = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Videos not found', errorMessage: error.message });
  }
};

const addVideoToDb = async (req, res) => {
  try {
    const video = req.body;
    const newVideo = new Video(video);
    const addedVideo = await newVideo.save();
    res.status(200).json({ success: true, addedVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: 'failed to add video', errorMessage: error.message });
  }
};

module.exports = { getVideosFromDb, addVideoToDb };
