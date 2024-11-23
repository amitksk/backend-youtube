import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { 
    getChannelSubscriber, 
    getChannelSubscribersList, 
    getSubscribedChannelsList, 
    toggleSubscription, 
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/:channelId").post(toggleSubscription)
router.route("/get-subscriber/:channelId").get(getChannelSubscriber)
router.route("/channel-subscribers/:channelId").get(getChannelSubscribersList)
router.route("/subscribed-channels/:subscriberId").get(getSubscribedChannelsList)


export default router;