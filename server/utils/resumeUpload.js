// utils/resumeUpload.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const sanitize = (name = '') => {
  // remove extension, replace unsafe chars with underscore, limit length
  return name.replace(/\.[^/.]+$/, '').replace(/[^\w\-]/g, '_').slice(0, 80);
};

export const uploadResumeToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const b64 = Buffer.from(buffer).toString('base64');
    const dataURI = "data:application/pdf;base64," + b64;

    // Put folder in public_id for a neat path
    const publicIdWithoutExt = `proconnect/resumes/resume_${Date.now()}_${sanitize(originalname)}`;

    cloudinary.uploader.upload(dataURI, {
      resource_type: 'raw',                // raw for PDFs
      public_id: publicIdWithoutExt,       // no extension here
      use_filename: false,
      unique_filename: false,
      overwrite: false,
      format: 'pdf',
      // optional: set content_disposition so downloaded header is attachment when possible
      content_disposition: `attachment; filename="${originalname.replace(/"/g, '')}"`
    }, (error, result) => {
      if (error) {
        console.error('Resume upload error:', error);
        return reject(error);
      }

      // Build a URL that forces download using Cloudinary transformation fl_attachment.
      // It follows the pattern:
      // https://res.cloudinary.com/<cloud_name>/raw/upload/fl_attachment/v<version>/<public_id>.<format>
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const downloadUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/v${result.version}/${result.public_id}.${result.format}`;

      // Return both the original result and a download_url
      resolve({
        ...result,
        download_url: downloadUrl
      });
    });
  });
};
