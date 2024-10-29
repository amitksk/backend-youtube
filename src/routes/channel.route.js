import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createChannel, getChannelStats } from "../controllers/channel.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT)


router.route("/create-channel").post(
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


export default router; 