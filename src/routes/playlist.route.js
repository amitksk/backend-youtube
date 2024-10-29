import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    addVideoToPlaylist, 
    createPlaylist, 
    deletePlaylist, 
    getPlaylistById, 
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";


const router = Router()



router.use(verifyJWT)

router.route("/create-playlist").post(createPlaylist)
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist)   // send req from only url.
router.route("/user/:userId").get(getUserPlaylists)

router
.route("/:playlistId")
.get(getPlaylistById)
.delete(deletePlaylist)
.patch(updatePlaylist)

router.route("/videoRemove/:playlistId/:videoId").patch(removeVideoFromPlaylist)


export default router;