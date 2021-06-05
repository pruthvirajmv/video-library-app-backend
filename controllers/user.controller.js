const { Playlist } = require("../models/playlist.model");
const { User } = require("../models/user.model");
const { LikedVideo } = require("../models/likedVideo.model");
const { History } = require("../models/history.model");

var jwt = require("jsonwebtokens");
const JWT_KEY = process.env.JWT_KEY;
var bcrypt = require("bcrypt");

const { extend } = require("lodash");

const addNewUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;

      const user = { userName: username, email: email, password: password };
      const NewUser = new User(user);
      const salt = await bcrypt.genSalt(10);
      NewUser.password = await bcrypt.hash(NewUser.password, salt);
      NewUser = await NewUser.save();

      const userPlaylist = new Playlist({
         userId: NewUser._id,
         playlists: { name: "Watch Later", videos: [] },
      });
      userPlaylist.save();

      const userLikedVideos = new LikedVideo({ userId: NewUser._id });
      userLikedVideos.save();

      const userHistory = new History({ userId: NewUser._id });
      userHistory.save();

      NewUser.__v = undefined;
      NewUser.password = undefined;

      res.status(200).json({ success: true, message: "user added", NewUser });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: "could not add user",
         errorMessage: err.message,
      });
   }
};

const loginUser = async (req, res) => {
   try {
      const { username, password } = req.body;

      let user = await User.findOne({ userName: username });

      if (user) {
         const verifyPassword = await bcrypt.compare(password, user.password);
         if (verifyPassword) {
            const token = jwt.sign({ userId: user.__id }, JWT_KEY, { expiresIn: "24h" });
            user.__v = undefined;
            user.password = undefined;
            res.status(200).json({ success: true, message: "user logged in", user, token });
         }
         return res
            .status(403)
            .json({ success: false, message: "username and password did not match" });
      }
      res.status(200).json({ success: false, message: "user does not exist " });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: "cannot retrieve user",
         errorMessage: err.message,
      });
   }
};

const resetOrUpdateUserPassword = async (req, res) => {
   try {
      const { email, password } = req.body;
      const updateUserPassword = { password: password };
      let user = await User.findOne({ email: email });

      if (!user) {
         return res.status(404).json({ success: true, message: "user does not exist" });
      }
      user = extend(user, updateUserPassword);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      user = await user.save();
      res.status(200).json({ success: true, message: "user credentials updated", user });
   } catch (err) {
      res.status(500).json({
         success: false,
         message: "cannot retrieve user",
         errorMessage: err.message,
      });
   }
};

const getUserProfile = (req, res) => {
   const { user } = req;
   user.__v = undefined;
   res.status(200).json({ success: true, user });
};

module.exports = { addNewUser, loginUser, resetOrUpdateUserPassword, getUserProfile };
