import { Router } from "express";
import { registerUser } from "../controllers/user.conroller.js";
import { upload } from "../middlewares/multer.middleware.js"
const router = Router()


router.route("/resgister").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,


        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
)

export default router