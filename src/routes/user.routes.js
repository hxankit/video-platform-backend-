import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.conroller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()


router.route("/resgister").post(upload.fields([{name: "avatar",maxCount: 1,},{name: "coverimage",maxCount: 1}]),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
 
export default router    //exporting name of this is UserRouter