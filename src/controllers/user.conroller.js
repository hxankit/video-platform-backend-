import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import { uploadOnClouldinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiresponse.js"


const registerUser = asynchandler(async (req, res) => {
    //get userr details from fronend
    //validation - not empty
    //check if user already exists: username,email
    //check for images ,check for avatar
    //uploAD them to cloudnary,avatar
    // create user object-create entry in db
    //remove password and refresh token field from response
    //check for usr creation
    //return res


    const { username, email, fullname, password } = req.body

    console.log(req.files);

    if ([fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All files are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }
    console.log(res.files);

    // const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverimagelocalpath = req.files?.coverimage[0]?.path;

    // if (!avatarlocalpath) {
    //     throw new ApiError(400, "avatar file is required")

    // }
    // const avatar = await uploadOnClouldinary(avatarlocalpath)
    // const coverimage = await uploadOnClouldinary(coverimagelocalpathlocalpath)

    // if (!avatar) {
    //     throw new ApiError(400, "avatar file is required")
    // }

    const user = await User.create({
        fullname,
        // avatar: avatar.url, // Ensure avatar.url exists if used
        // coverimage: coverimage?.url || "", // Ensure coverimage.url exists if used
        email,
        password,
        username: username.toLowerCase()
    });

    // Fetch the created user excluding sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshtoken"); // Exclude password and refreshtoken fields

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // Continue with further logic if needed


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User resgisterd succrsfully")
    )
})

export { registerUser }