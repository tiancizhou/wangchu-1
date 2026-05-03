import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

function parseGallery(value: unknown) {
  return Array.isArray(value) ? JSON.stringify(value.filter((item) => typeof item === 'string')) : '[]';
}

function mapProduct(product: { galleryImageUrls: string }) {
  return { ...product, galleryImageUrls: JSON.parse(product.galleryImageUrls || '[]') as string[] };
}

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(products.map(mapProduct));
});

router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) {
    res.status(404).json({ message: '商品不存在' });
    return;
  }
  res.json(mapProduct(product));
});

router.post('/', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.slug) {
    res.status(400).json({ message: '商品名称和链接标识不能为空' });
    return;
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      category: body.category || '工业油品',
      summary: body.summary || '',
      description: body.description || '',
      coverImageUrl: body.coverImageUrl || '',
      galleryImageUrls: parseGallery(body.galleryImageUrls),
      sortOrder: Number(body.sortOrder || 0),
      isPublished: Boolean(body.isPublished)
    }
  });
  res.status(201).json(mapProduct(product));
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: {
      name: body.name,
      slug: body.slug,
      category: body.category || '工业油品',
      summary: body.summary || '',
      description: body.description || '',
      coverImageUrl: body.coverImageUrl || '',
      galleryImageUrls: parseGallery(body.galleryImageUrls),
      sortOrder: Number(body.sortOrder || 0),
      isPublished: Boolean(body.isPublished)
    }
  });
  res.json(mapProduct(product));
});

router.delete('/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
