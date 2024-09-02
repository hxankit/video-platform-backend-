import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadOnClouldinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file upload succesfully
        console.log("file uploadded on cloudinary", response.url);
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the local saved temp file 
    }
}

export { uploadOnClouldinary }