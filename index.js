const express = require("express");
require("body-parser");

const errorHandler = require("./middlewares/error-handler.middleware");
const routeNotFound = require("./middlewares/route-not-found-handler.middleware");

const videos = require("./routers/video.router");
const user = require("./routers/user.route");
const playlists = require("./routers/playlist.route");
const likedVideos = require("./routers/likedvideos.router");
const history = require("./routers/history.router");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const dbConnect = require("./db/db.connect");
const { authentication } = require("./middlewares/authentication.middleware");
dbConnect();

app.get("/", (req, res) => {
   res.json("Welcome to BaddyShots backend!");
});

app.use("/videos", videos);

app.use(authentication);
app.use("/user", user);
app.use("/playlists", playlists);
app.use("/likedvideos", likedVideos);
app.use("/history", history);

// must stay last
app.use(errorHandler);
app.use(routeNotFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log("Server Started");
});
