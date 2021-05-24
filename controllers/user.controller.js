const { Playlist } = require("../models/playlist.model");
const { User } = require("../models/user.model");
const { LikedVideo } = require("../models/likedVideo.model");
const { History } = require("../models/history.model");

const { extend } = require("lodash");

const addNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = { userName: username, email: email, password: password };
    const NewUser = new User(user);
    const addedUser = await NewUser.save();

    const userPlaylist = new Playlist({ userId: addedUser._id, playlists: { name: "Watch Later", videos: [] } });
    await userPlaylist.save();

    const userLikedVideos = new LikedVideo({ userId: addedUser._id });
    await userLikedVideos.save();

    const userHistory = new History({ userId: addedUser._id });
    userHistory.save();

    addedUser.__v = undefined;
    addedUser.password = undefined;

    res.status(200).json({ success: true, addedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "could not add user", errorMessage: err.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ userName: username });

    if (!user || user.password !== password) {
      return res.status(403).json({ success: true, message: "username and password did not match" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "cannot retrieve user", errorMessage: err.message });
  }
};

const userResetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const updateUserPassword = { password: password };
    let user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ success: true, message: "user does not exist" });
    }
    user = extend(user, updateUserPassword);
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "cannot retrieve user", errorMessage: err.message });
  }
};

const checkAndGetUser = async (req, res, next, userId) => {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "error user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "failed to retrive user" });
  }
};

const getUserProfile = (req, res) => {
  const { user } = req;
  user.__v = undefined;
  res.status(200).json({ success: true, user });
};

module.exports = { addNewUser, userLogin, userResetPassword, checkAndGetUser, getUserProfile };
