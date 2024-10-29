import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js"
import { 
    deleteVideo,
    getAllvideos,
    getVideoById,
    PublishAvideo,
    togglePublishStatus,
    updateVideo,
 } from "../controllers/video.controller.js";
const router = Router()



router.use(verifyJWT); 

router.route("/").get(getAllvideos)
router.route("/publish-video").post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        PublishAvideo
    );
router.route("/:videoId").get(getVideoById)
router.route("/update-video/:videoId").put(upload.single("thumbnail"),updateVideo)
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/toggle/:videoId").patch(togglePublishStatus)

export default router;
