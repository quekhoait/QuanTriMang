const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteCloudinaryFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Đã xóa file Cloudinary:", result);
    return result;
  } catch (err) {
    console.error("Lỗi khi xóa file Cloudinary:", err);
    throw err;
  }
};

module.exports = {
  cloudinary,
  deleteCloudinaryFile
};
