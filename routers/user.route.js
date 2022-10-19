const express = require("express");
const router = express.Router();

const {
   addNewUser,
   loginUser,
   resetOrUpdateUserPassword,
   getUserProfile,
   updateUserProfile,
} = require("../controllers/user.controller");

const { authentication } = require("../middlewares/authentication.middleware");

router.route("/").get(authentication, getUserProfile).post(authentication, updateUserProfile);

router.route("/register").post(addNewUser);

router.route("/login").post(loginUser);

router.route("/resetpassword").post(resetOrUpdateUserPassword);

module.exports = router;
