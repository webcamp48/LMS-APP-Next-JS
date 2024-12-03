
require("dotenv").config();
import { v2 as cloudinary } from 'cloudinary';

// cloudinary config
export const cloudinaryConfig = () => {
    return cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_SECRET_KEY,
    });
}
