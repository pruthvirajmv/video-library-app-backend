const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  playlists: [
    {
      name: {
        type: String,
        required: "Please provide the playlist name",
      },

      videos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Video",
        },
      ],
    },
  ],
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = {
  Playlist,
};
