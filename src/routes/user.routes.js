import { Router } from "express";
import { getUserChannelProfile, registerUser } from "../controllers/user.controller.js";
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    getUserChannelProfile, 
    getWatchHistory, 
    updateUserCoverImage 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const router = Router();

router.route('/register').post(
    upload.fields(
        [
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 }
        ]
    ),
    registerUser
);

router.route('/login').post(loginUser);

//secured route
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/update-account').patch(verifyJWT, updateAccountDetails);
router.route('/avatar').put(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route('/cover-image').put(verifyJWT, upload.single("coverImage"),updateUserCoverImage);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/c/:username').get(verifyJWT, getUserChannelProfile);
router.route('/history').get(verifyJWT, getWatchHistory);


export default router;