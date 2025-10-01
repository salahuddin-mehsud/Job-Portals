// utils/cloudinaryUpload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const b64 = Buffer.from(buffer).toString('base64');
    const dataURI = "data:" + mimetype + ";base64," + b64;

    // Determine resource type based on mimetype
    let resourceType = 'auto';
    const options = {
      folder: 'proconnect/resumes',   // keep your folder
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      upload_preset: 'job_resumes'   // <-- new preset name you created
    };

    if (mimetype === 'application/pdf') {
      resourceType = 'raw';           // use raw for PDFs
      options.resource_type = 'raw';
      options.content_disposition = 'inline'; // so browser can open PDF
      options.format = 'pdf';
    } else {
      options.resource_type = resourceType;
    }

    cloudinary.uploader.upload(dataURI, options, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        console.log('Cloudinary upload successful:', result.secure_url);
        resolve(result);
      }
    });
  });
};
