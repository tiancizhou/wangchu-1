import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';
import { parseJsonArray, stringifyJson } from '../utils/jsonFields.js';

const router = Router();
router.use(requireAdmin);

function parseStringArray(value: unknown) {
  return Array.isArray(value) ? stringifyJson(value.filter((item) => typeof item === 'string'), []) : '[]';
}

function mapProduct(product: {
  galleryImageUrls: string;
  specificationsJson: string;
  detailSectionsJson: string;
  featureCardsJson: string;
}) {
  return {
    ...product,
    galleryImageUrls: parseJsonArray<string>(product.galleryImageUrls),
    specifications: parseJsonArray<Record<string, unknown>>(product.specificationsJson),
    detailSections: parseJsonArray<Record<string, unknown>>(product.detailSectionsJson),
    featureCards: parseJsonArray<Record<string, unknown>>(product.featureCardsJson)
  };
}

function productData(body: Record<string, unknown>) {
  return {
    name: String(body.name || ''),
    slug: String(body.slug || ''),
    category: String(body.category || '工业油品'),
    categoryId: body.categoryId ? String(body.categoryId) : null,
    subtitle: String(body.subtitle || ''),
    summary: String(body.summary || ''),
    description: String(body.description || ''),
    coverImageUrl: String(body.coverImageUrl || ''),
    galleryImageUrls: parseStringArray(body.galleryImageUrls),
    specificationsJson: stringifyJson(body.specifications || [], []),
    detailSectionsJson: stringifyJson(body.detailSections || [], []),
    featureCardsJson: stringifyJson(body.featureCards || [], []),
    sortOrder: Number(body.sortOrder || 0),
    isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished),
    seoTitle: String(body.seoTitle || ''),
    seoDescription: String(body.seoDescription || '')
  };
}

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({
    include: { categoryRef: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(products.map(mapProduct));
});

router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { categoryRef: true } });
  if (!product) {
    res.status(404).json({ message: '商品不存在' });
    return;
  }
  res.json(mapProduct(product));
});

router.post('/', async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body.name || !body.slug) {
    res.status(400).json({ message: '商品名称和链接标识不能为空' });
    return;
  }

  const product = await prisma.product.create({ data: productData(body), include: { categoryRef: true } });
  res.status(201).json(mapProduct(product));
});

router.put('/:id', async (req, res) => {
  const body = req.body as Record<string, unknown>;
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: productData(body),
    include: { categoryRef: true }
  });
  res.json(mapProduct(product));
});

router.delete('/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
