import path from 'node:path';
import multer from 'multer';

const uploadDir = path.resolve(process.cwd(), 'uploads');

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error('只支持 jpg、png、webp 图片'));
  }
});
