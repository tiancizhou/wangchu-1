import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res) => {
  const categories = await prisma.productCategory.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.json(categories);
});

router.post('/', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.slug) {
    res.status(400).json({ message: '分类名称和链接标识不能为空' });
    return;
  }

  const category = await prisma.productCategory.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      coverImageUrl: body.coverImageUrl || '',
      iconImageUrl: body.iconImageUrl || '',
      sortOrder: Number(body.sortOrder || 0),
      isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
      seoTitle: body.seoTitle || '',
      seoDescription: body.seoDescription || ''
    }
  });
  res.status(201).json(category);
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  const category = await prisma.productCategory.update({
    where: { id: req.params.id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      coverImageUrl: body.coverImageUrl || '',
      iconImageUrl: body.iconImageUrl || '',
      sortOrder: Number(body.sortOrder || 0),
      isPublished: Boolean(body.isPublished),
      seoTitle: body.seoTitle || '',
      seoDescription: body.seoDescription || ''
    }
  });
  res.json(category);
});

router.delete('/:id', async (req, res) => {
  await prisma.productCategory.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
