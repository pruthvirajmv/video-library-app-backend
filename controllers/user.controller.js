const { Playlist } = require("../models/playlist.model");
const { User } = require("../models/user.model");
const { LikedVideo } = require("../models/likedVideo.model");
const { History } = require("../models/history.model");

var jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY;
var bcrypt = require("bcrypt");

const { extend } = require("lodash");

const addNewUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;

      const user = { userName: username, email: email, password: password };
      const newUser = new User(user);
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      await newUser.save();

      const userPlaylist = new Playlist({
         userId: newUser._id,
         playlists: { name: "Watch Later", videos: [] },
      });
      userPlaylist.save();

      const userLikedVideos = new LikedVideo({ userId: newUser._id });
      userLikedVideos.save();

      const userHistory = new History({ userId: newUser._id });
      userHistory.save();

      newUser.__v = undefined;
      newUser.password = undefined;

      res.status(200).json({ success: true, message: "user added", newUser });
   } catch (err) {
      console.log(err);
      if (err.name === "MongoError" && err.code === 11000) {
         console.log(err.keyPattern.userName, err.keyPattern.email);
         if (err.keyPattern.userName) {
            return res.status(422).json({
               success: false,
               message: "user name is already taken",
               errorMessage: err.message,
            });
         } else if (err.keyPattern.email) {
            return res.status(422).json({
               success: false,
               message: "account already exists with this email",
               errorMessage: err.message,
            });
         }
      }
      res.status(500).json({
         success: false,
         message: "could not add user",
         errorMessage: err.message,
      });
   }
};

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });

      if (user) {
         const verifyPassword = await bcrypt.compare(password, user.password);
         if (verifyPassword) {
            const token = jwt.sign({ userId: user._id }, JWT_KEY, { expiresIn: "24h" });
            user.__v = undefined;
            user.password = undefined;
            return res.status(200).json({ success: true, message: "user logged in", user, token });
         }
         return res
            .status(403)
            .json({ success: false, message: "username and password did not match" });
      }
      res.status(400).json({ success: false, message: "user does not exist " });
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

const updateUserProfile = async (req, res) => {
   try {
      let { user } = req;
      const { password } = req.body;
      const updateUserPassword = { password: password };
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

module.exports = {
   addNewUser,
   loginUser,
   resetOrUpdateUserPassword,
   getUserProfile,
   updateUserProfile,
};
