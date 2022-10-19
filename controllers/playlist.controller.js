const { Playlist } = require("../models/playlist.model");

const checkAndGetUserPlaylist = async (req, res, next) => {
   try {
      const userId = req.user._id;
      const userPlaylist = await Playlist.findOne({ userId: userId });
      if (!userPlaylist) {
         return res.status(404).json({ success: false, message: "user does not exists" });
      }

      req.userPlaylist = userPlaylist;
      next();
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "could not retreive user playlist",
         errorMessage: error.message,
      });
   }
};

const getUserPlaylist = async (req, res) => {
   try {
      let userPlaylist = req.userPlaylist;
      userPlaylist = await userPlaylist.populate("playlists.videos").execPopulate();
      res.status(200).json({ success: true, playlists: userPlaylist.playlists });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "something went wrong",
         errorMessage: error.message,
      });
   }
};

const createNewPlaylist = async (req, res) => {
   try {
      const { playlistName, videoId } = req.body;
      const userPlaylist = req.userPlaylist;
      const addNewPlaylist = { name: playlistName, videos: [videoId] };
      userPlaylist.playlists.push(addNewPlaylist);
      await userPlaylist.save();
      await userPlaylist.populate("playlists.videos").execPopulate();
      res.status(200).json({ success: true, playlist: userPlaylist });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "something went wrong",
         errorMessage: error.message,
      });
   }
};

const toggleVideoInPlaylist = async (req, res) => {
   try {
      const { playlistName } = req.body;
      const { video } = req.body;
      let userPlaylist = req.userPlaylist;
      let selectedPlaylist = userPlaylist.playlists.find(({ name }) => name === playlistName);
      const isVideoPresent = selectedPlaylist.videos.find(
         (videoId) => videoId.toString() === video
      );
      if (isVideoPresent) {
         selectedPlaylist.videos = selectedPlaylist.videos.filter(
            (videoId) => videoId.toString() !== video
         );
      } else {
         selectedPlaylist.videos.push(video);
      }
      await userPlaylist.save();
      userPlaylist = await userPlaylist.populate("playlists.videos").execPopulate();
      res.status(200).json({ success: true, playlist: selectedPlaylist });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "something went wrong",
         errorMessage: error.message,
      });
   }
};

const editPlaylistName = async (req, res) => {
   try {
      const { playlistName } = req.body;
      const { updatedPlaylistName } = req.body;
      const userPlaylist = req.userPlaylist;
      let selectedPlaylist = userPlaylist.playlists.find(({ name }) => name === playlistName);
      selectedPlaylist.name = updatedPlaylistName;
      await userPlaylist.save();
      res.status(200).json({ success: true, selectedPlaylist });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "something went wrong",
         errorMessage: error.message,
      });
   }
};

const removePlaylist = async (req, res) => {
   try {
      const { playlistName } = req.body;
      let userPlaylist = req.userPlaylist;
      userPlaylist.playlists = userPlaylist.playlists.filter(({ name }) => name !== playlistName);
      await userPlaylist.save();
      res.status(200).json({ success: true, userPlaylist });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "something went wrong",
         errorMessage: error.message,
      });
   }
};

module.exports = {
   checkAndGetUserPlaylist,
   getUserPlaylist,
   createNewPlaylist,
   toggleVideoInPlaylist,
   editPlaylistName,
   removePlaylist,
};
