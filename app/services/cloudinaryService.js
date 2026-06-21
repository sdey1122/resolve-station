/**
 * ==========================================
 * Cloudinary Service
 * ==========================================
 */

const streamifier = require("streamifier");

const cloudinary = require("../config/cloudinaryConfig");

/**
 * ==========================================
 * UPLOAD PROFILE IMAGE
 * ==========================================
 */

const uploadProfileImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/users`,

        resource_type: "image",

        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          publicId: result.public_id,

          url: result.secure_url,

          uploadedAt: new Date(),
        });
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * ==========================================
 * DELETE IMAGE
 * ==========================================
 */

const deleteProfileImage = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
  }
};

/**
 * ==========================================
 * REPLACE PROFILE IMAGE
 * ==========================================
 */

const replaceProfileImage = async (oldPublicId, fileBuffer) => {
  if (oldPublicId && oldPublicId !== null) {
    await deleteProfileImage(oldPublicId);
  }

  return uploadProfileImage(fileBuffer);
};

/**
 * ==========================================
 * RESTORE DEFAULT AVATAR
 * ==========================================
 */

const restoreDefaultAvatar = async (oldPublicId) => {
  if (oldPublicId) {
    await deleteProfileImage(oldPublicId);
  }

  return {
    publicId: null,

    url: process.env.DEFAULT_AVATAR_URL,

    uploadedAt: null,
  };
};

module.exports = {
  uploadProfileImage,
  deleteProfileImage,
  replaceProfileImage,
  restoreDefaultAvatar,
};
