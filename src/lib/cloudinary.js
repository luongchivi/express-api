const cloudinary = require('cloudinary').v2;
const mime = require('mime-types');

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * Upload single image to Cloudinary
 * @param {Object} file - single of file objects to be uploaded
 * @param {String} folder - The folder in Cloudinary where images will be stored
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of image URL
 */
async function uploadImage(file, folder) {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        },
      ).end(file.buffer);
    });
  } catch (error) {
    throw new Error(`Error uploading single image: ${error.message}`);
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects to be uploaded
 * @param {String} folder - The folder in Cloudinary where images will be stored
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of image URLs
 */
async function uploadImages(files, folder) {
  try {
    // Tạo mảng các promises để upload các file
    const uploadPromises = files.map(file => {
      // Kiểm tra xem tệp có phải là ảnh không
      const mimeType = mime.lookup(file.originalname);
      if (!mimeType || !mimeType.startsWith('image/')) {
        return Promise.reject(new Error('Invalid file type. Only images are allowed.'));
      }

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          },
        ).end(file.buffer); // Truyền buffer của file vào stream upload
      });
    });

    // Chờ tất cả các uploads hoàn tất và trả về các URL
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    throw new Error(`Error uploading multiple images: ${error.message}`);
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {String} imageUrl - The URL of the image
 * @param {String} folder - The folder in Cloudinary where images are stored
 * @returns {String} - The public ID of the image
 */
function getPublicIdFromUrl(imageUrl, folder) {
  const urlSegments = imageUrl.split('/');
  const imageNameWithExtension = urlSegments[urlSegments.length - 1];
  const imageName = imageNameWithExtension.split('.')[0];
  return `${folder}/${imageName}`;
}

/**
 * Delete single image from Cloudinary
 * @param {String} imageUrl - The URL of the image to be deleted
 * @param {String} folder - The folder in Cloudinary where images are stored
 * @returns {Promise<void>}
 */
async function deleteImage(imageUrl, folder) {
  try {
    const publicId = getPublicIdFromUrl(imageUrl, folder);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Error deleting single image: ${error.message}`);
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param {Array} imageUrls - Array of image URLs to be deleted
 * @param {String} folder - The folder in Cloudinary where images are stored
 * @returns {Promise<void>}
 */
async function deleteImages(imageUrls, folder) {
  try {
    const publicIds = imageUrls.map(url => {
      // Extract the public ID from the URL
      const urlParts = url.split('/');
      const publicId = urlParts[urlParts.length - 1].split('.')[0];
      return `${folder}/${publicId}`;
    });

    // Create an array of promises for deleting files
    const deletePromises = publicIds.map(publicId => new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    }));

    // Wait for all deletions to complete
    await Promise.all(deletePromises);
  } catch (error) {
    throw new Error(`Error deleting multiple images: ${error.message}`);
  }
}

module.exports = {
  uploadImages,
  uploadImage,
  deleteImages,
  getPublicIdFromUrl,
  deleteImage,
};
