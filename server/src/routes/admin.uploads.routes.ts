import { Router } from 'express';
import { imageUpload, mediaUpload } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

async function saveUploadedFile(file: Express.Multer.File) {
  const url = `/uploads/${file.filename}`;
  return prisma.uploadedFile.create({
    data: {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url
    }
  });
}

router.post('/images', imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '请选择图片文件' });
    return;
  }

  res.status(201).json(await saveUploadedFile(req.file));
});

router.post('/media', mediaUpload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '请选择媒体文件' });
    return;
  }

  res.status(201).json(await saveUploadedFile(req.file));
});

export default router;
