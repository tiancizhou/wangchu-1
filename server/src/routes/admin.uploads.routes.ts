import { Router } from 'express';
import { imageUpload } from '../middleware/uploadMiddleware.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

router.post('/images', imageUpload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: '请选择图片文件' });
    return;
  }

  const url = `/uploads/${req.file.filename}`;
  const file = await prisma.uploadedFile.create({
    data: {
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url
    }
  });

  res.status(201).json(file);
});

export default router;
