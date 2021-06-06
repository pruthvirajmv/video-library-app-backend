const { History } = require("../models/history.model");

const checkAndGetUserHistory = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const userHistory = await History.findOne({ userId: userId });
      if (!userHistory) {
         return res.status(404).json({ success: false, message: "user does not exists" });
      }
      req.userHistory = userHistory;
      next();
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "could not retreive user history",
         errorMessage: error.message,
      });
   }
};

const getUserHistory = async (req, res) => {
   let { userHistory } = req;
   userHistory = await userHistory.populate("videos").execPopulate();
   res.status(200).json({ success: true, history: userHistory.videos });
};

const addVideoToHistory = async (req, res) => {
   try {
      const { video } = req.body;
      let { userHistory } = req;
      const isVideoPresent = userHistory.videos.find((videoId) => videoId.toString() === video);
      if (isVideoPresent) {
         userHistory.videos = userHistory.videos.filter((videoId) => videoId.toString() !== video);
         userHistory.videos.push(video);
      } else {
         userHistory.videos.push(video);
      }
      await userHistory.save();
      userHistory = await userHistory.populate("videos").execPopulate();
      res.status(200).json({ success: true, history: userHistory.videos });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "could not update user history",
         errorMessage: error.message,
      });
   }
};

const removeVideoFromHistory = async (req, res) => {
   let { video } = req.body;
   let { userHistory } = req;
   userHistory.videos = userHistory.videos.filter((videoId) => videoId.toString() !== video);
   await userHistory.save();
   res.status(200).json({ success: true, history: userHistory.videos });
};

const clearUserHistory = async (req, res) => {
   let { userHistory } = req;
   userHistory.videos = [];
   await userHistory.save();
   res.status(200).json({ success: true });
};

module.exports = {
   checkAndGetUserHistory,
   getUserHistory,
   addVideoToHistory,
   removeVideoFromHistory,
   clearUserHistory,
};
