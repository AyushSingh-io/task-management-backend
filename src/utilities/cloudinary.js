import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type  : "auto"
        })

        fs.unlinkSync(localFilePath)

        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("Something went wrong while uplaoding file to cloudinary : ", error)
        return null
    }
}

const deleteFromCloudinary = async (oldImageUrl) => {
    try {
        if(!oldImageUrl)  return null;

        const startIdx = oldImageUrl.lastIndexOf('/');
        const publicId = oldImageUrl.slice(startIdx+ 1, oldImageUrl.length - 4);

        if(!publicId)  return null;

        const response = await cloudinary.uploader.destroy(publicId , {
            resource_type : "image"
        })

        return response;
        
    } catch (error) {
        console.log("Error occured while deleting old  file: ", error)
        return null;
    }
}

export {uploadOnCloudinary  ,  deleteFromCloudinary}