import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createChannel, getChannelStats, getChannelVideos } from "../controllers/channel.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT)


router.route("/").post(
    upload.fields([
        {
            name: "logo",
            maxCount: 1,
        },
        {
            name: "banner",
            maxCount: 1,
        },
    ]), createChannel)
router.route("/:channelId").get(getChannelStats)
router.route("/channelVideo/:channelId").get(getChannelVideos)


export default router; 