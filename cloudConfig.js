require("dotenv").config();

console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.CLOUD_API_KEY);
console.log(
  "API Secret:",
  process.env.CLOUD_API_SECRET ? "Loaded ✅" : "Missing ❌"
);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "WanderLust_DEV",
        resource_type: "image",
        allowed_formats: ["png", "jpg", "jpeg"],
    }),
});

module.exports = {
    cloudinary,
    storage,
};