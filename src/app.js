import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//-----------------routes import------------------
import userRouter from "./routes/user.routes.js"
import videoRouter from "./routes/video.route.js"
import playlistRouter from "./routes/playlist.route.js"
import commentRouter from "./routes/comment.route.js"
import tweetRouter from "./routes/tweet.route.js"
import likeRouter from "./routes/like.route.js"
import channelRouter from "./routes/channel.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import healthcheckRouter from "./routes/healthcheck.route.js"


// http://localhost:8000/api/v1/users/register
//-----------------routes declaration-------------
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/channels", channelRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

export default app;
