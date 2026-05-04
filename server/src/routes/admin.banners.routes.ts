import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res) => {
  const banners = await prisma.carouselBanner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(banners);
});

router.post('/', async (req, res) => {
  const body = req.body;
  if (!body.imageUrl) {
    res.status(400).json({ message: '请先上传轮播图媒体文件' });
    return;
  }

  const banner = await prisma.carouselBanner.create({
    data: {
      title: body.title || '轮播图',
      subtitle: '',
      imageUrl: body.imageUrl,
      linkUrl: '',
      sortOrder: Number(body.sortOrder || 0),
      isActive: body.isActive === undefined ? true : Boolean(body.isActive)
    }
  });
  res.status(201).json(banner);
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  if (!body.imageUrl) {
    res.status(400).json({ message: '请先上传轮播图媒体文件' });
    return;
  }

  const banner = await prisma.carouselBanner.update({
    where: { id: req.params.id },
    data: {
      title: body.title || '轮播图',
      subtitle: '',
      imageUrl: body.imageUrl,
      linkUrl: '',
      sortOrder: Number(body.sortOrder || 0),
      isActive: body.isActive === undefined ? true : Boolean(body.isActive)
    }
  });
  res.json(banner);
});

router.delete('/:id', async (req, res) => {
  await prisma.carouselBanner.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
