const express = require("express");
const {
   checkAndGetUserHistory,
   getUserHistory,
   addVideoToHistory,
   removeVideoFromHistory,
   clearUserHistory,
} = require("../controllers/history.controller");

const router = express.Router();

router.use(checkAndGetUserHistory);

router.route("/").get(getUserHistory).post(addVideoToHistory);

router.route("/remove").post(removeVideoFromHistory);

router.route("/clear").get(clearUserHistory);

module.exports = router;
