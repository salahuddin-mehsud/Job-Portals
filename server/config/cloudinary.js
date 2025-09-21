import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // make sure env vars load before config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
});

export default cloudinary;
