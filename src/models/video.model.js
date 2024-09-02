import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = mongoose.Schema(
    {
        videofile: {
            type: String,
            required: true,

        },
        thumbnail: {
            type: String,
            required: true,

        },
        title: {
            type: String,
            required: true,

        },
        discription: {
            type: String,
            required: true,

        },
        duration: {
            type: String,
            required: true,

        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "user"
        }
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema)
