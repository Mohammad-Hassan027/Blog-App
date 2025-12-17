const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No file provided" });
    }

    const folder = req.body.folder || "blog";

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res
            .status(500)
            .json({ error: error.message || "Upload failed" });
        }

        return res.json({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Upload handler error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.deleteImage = (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id)
      return res.status(400).json({ error: "public_id is required" });

    cloudinary.uploader.destroy(
      public_id,
      { invalidate: true },
      (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          return res
            .status(500)
            .json({ error: error.message || "Delete failed" });
        }

        return res.json({ result });
      }
    );
  } catch (err) {
    console.error("Delete handler error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};
