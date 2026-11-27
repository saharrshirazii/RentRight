
// import fs from 'fs';
// import path from 'path';
// import multer from 'multer';

// const uploadDirectory = process.env.VERCEL
//   ? path.join('/tmp', 'uploads')
//   : path.resolve(process.cwd(), 'uploads');

// if (!fs.existsSync(uploadDirectory)) {
//   fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDirectory);
//   },
//   filename: (_req, file, cb) => {
//     const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
//     cb(null, `${Date.now()}-${safeOriginalName}`);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: {
//     files: 12,
//     fileSize: 25 * 1024 * 1024,
//   },
//   fileFilter: (_req, file, cb) => {
//     if (!file.mimetype.startsWith('image/')) {
//       cb(new Error('Endast bildfiler är tillåtna'));
//       return;
//     }

//     cb(null, true);
//   },
// });

// export { uploadDirectory };


import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
export { cloudinary };
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Determine environment
const isVercel = process.env.VERCEL === '1';

// Local upload directory
export const uploadDirectory = isVercel
  ? path.join('/tmp', 'uploads')
  : path.resolve(process.cwd(), 'uploads');

// Create local upload directory when needed
if (!isVercel && !fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Local storage
const localStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const safeOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      '-'
    );
    cb(null, `${Date.now()}-${safeOriginalName}`);
  },
});

// Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    public_id: (_req: import('express').Request, file: Express.Multer.File) => {
      const safeName = file.originalname
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-');

      return `${Date.now()}-${safeName}`;
    },
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    folder: 'rentright/listings',
  } as any,
});



// Select storage based on environment
const storage = isVercel ? cloudinaryStorage : localStorage;

export const upload = multer({
  storage,
  limits: {
    files: 12,
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Endast bildfiler är tillåtna'));
      return;
    }

    cb(null, true);
  },
});

