const { LikedVideo } = require("../models/likedVideo.model");

const checkAndGetUserLikedVideos = async (req, res, next, userId) => {
  try {
    const userLikedVideos = await LikedVideo.findOne({ userId: userId });
    if (!userLikedVideos) {
      return res.status(404).json({ success: false, message: "user does not exists" });
    }

    req.userLikedVideos = userLikedVideos;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "could not retreive user Liked Videos", errorMessage: error.message });
  }
};

const getUserLikedVideos = async (req, res) => {
  let { userLikedVideos } = req;
  userLikedVideos = await userLikedVideos.populate("videos").execPopulate();
  res.status(200).json({ success: true, likedVideos: userLikedVideos.videos });
};

const toggleLikedVideo = async (req, res) => {
  try {
    const { video } = req.body;
    let { userLikedVideos } = req;
    const isVideoPresent = userLikedVideos.videos.find((videoId) => videoId.toString() === video);
    if (isVideoPresent) {
      userLikedVideos.videos = userLikedVideos.videos.filter((videoId) => videoId.toString() !== video);
    } else {
      userLikedVideos.videos.push(video);
    }
    await userLikedVideos.save();
    userLikedVideos = await userLikedVideos.populate("videos").execPopulate();
    res.status(200).json({ success: true, likedVideos: userLikedVideos.videos });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "could not update user liked videos", errorMessage: error.message });
  }
};

module.exports = { checkAndGetUserLikedVideos, getUserLikedVideos, toggleLikedVideo };
