import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js"
import { ApiResponse } from "../utils/apiresponse.js"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // console.log(`access token ${accessToken}`);
        // console.log(`refresh token ${refreshToken}`);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error details:', error);
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};




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


    const { username, email, fullname, password } = req.body    //we are taking data from req body

    // console.log(req.body);
    // console.log(req.files);

    if ([fullname, email, username, password].some((field) =>  //checking that every feild of form is blank or not
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All files are required")
    }

    const existedUser = await User.findOne({     //checking the user is existed in the database or not  
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    // const coverimagelocalpath = req.files?.coverimage[0]?.path;

    let coverimagelocalpath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimagelocalpath = req.files.coverimage[0].path

    }
    if (!avatarlocalpath) {
        throw new ApiError(400, "avatar file is required")

    }
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverimage = await uploadOnCloudinary(coverimagelocalpath)

    // console.log(avatar);
    // console.log(coverimage);
    if (!avatar) {
        throw new ApiError(400, "avatar on cloud file is required")
    }
    // data abse logic
    const user = await User.create({
        fullname,
        avatar: avatar.url, // Ensure avatar.url exists if used
        coverimage: coverimage?.url || "", // Ensure coverimage.url exists if used
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



const loginUser = asynchandler(async (req, res) => {
    //req.body ->
    //username or email
    //find the user
    //password check
    //acces and refresh token
    //send cookies
    const { email, username, password } = req.body
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
        
    })
    if (!user) {
        throw new ApiError(404, "User does not existed")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(404, "invalid user crediantailsa")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    const options = {
        httpOnly: "true",

        secure: "true"

    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in succesfully"
            )
        )


})


const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: "" } // Use $unset to delete the field
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Secure cookies only in production
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export {
    registerUser,
    loginUser,
    logoutUser
}