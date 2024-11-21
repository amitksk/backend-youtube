import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    getChannelSubscriber, 
    getChannelSubscribersList, 
    toggleSubscription, 
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/:channelId").post(toggleSubscription)
router.route("/get-subscriber/:channelId").get(getChannelSubscriber)
router.route("/channel-subscriber-list/:channelId").get(getChannelSubscribersList)

export default router;