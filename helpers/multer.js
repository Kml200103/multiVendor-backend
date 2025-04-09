const cloudinary = require("../config/cloudinary");

// Check if Cloudinary is properly configured
if (!cloudinary || !cloudinary.uploader) {
  throw new Error("Cloudinary configuration failed.");
}

const uploadToCloudinary = async (files) => {
  try {
    const imageUploadPromises = files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Determine Cloudinary resource type based on file type
      const resourceType = file.mimetype.includes("image") ? "image" : "raw"; // 'raw' is for PDFs and other non-image files

   
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: resourceType, // Dynamic resource type
        use_filename:true,
        unique_filename: false, 
      });

      // console.log(result);
      return result.secure_url;
    });

    const imageUrls = await Promise.all(imageUploadPromises);
    return imageUrls;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload images"); // Re-throw the error to be handled by the caller
  }
};

module.exports = { uploadToCloudinary };
