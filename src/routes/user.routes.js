import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
import { changeCurrentPassword } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { updateAccountDetails } from "../controllers/user.controller.js";
import { updateUserAvatar } from "../controllers/user.controller.js";
import { updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
router.route('/update-profile').put(verifyJWT, updateAccountDetails);
router.route('/update-avatar').put(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route('/update-cover-image').put(verifyJWT, upload.single("coverImage"),
updateUserCoverImage);
router.route('/me').get(verifyJWT, getCurrentUser);


export default router;