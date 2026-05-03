import { Router } from 'express';
import { prisma } from '../prisma/client.js';

const router = Router();

function mapProduct(product: { galleryImageUrls: string }) {
  return {
    ...product,
    galleryImageUrls: JSON.parse(product.galleryImageUrls || '[]') as string[]
  };
}

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/banners', async (_req, res) => {
  const banners = await prisma.carouselBanner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(banners);
});

router.get('/products', async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 12), 1), 50);
  const keyword = String(req.query.keyword || '').trim();
  const category = String(req.query.category || '').trim();
  const where = {
    isPublished: true,
    ...(keyword ? { name: { contains: keyword } } : {}),
    ...(category ? { category } : {})
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where })
  ]);

  res.json({ items: items.map(mapProduct), total, page, pageSize });
});

router.get('/products/:slug', async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, isPublished: true }
  });

  if (!product) {
    res.status(404).json({ message: '商品不存在' });
    return;
  }

  res.json(mapProduct(product));
});

export default router;
