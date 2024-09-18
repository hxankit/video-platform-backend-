import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"


dotenv.config({
    path: './.env'
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true

    },
    avatar: {
        type: String, //cloudnary
        required: true,
    },
    coverimage: {
        type: String, //cloudnary
    },
    watchhistory: {
        type: Schema.Types.ObjectId,
        ref: "video"
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshtoken: {
        type: String
    }
},
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    // if (!ACCESS_TOKEN_SECRET) {
    //     console.log('Access token secret is not defined');
    // }
    // console.log(`this is acces tokens ${process.env.ACCEES_TOKEN_SECRET}`)
    return jwt.sign({

        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },

        process.env.ACCESS_TOKEN_SECRET, // Corrected variable name
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

// Corrected method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
};



export const User = mongoose.model("User", userSchema)
