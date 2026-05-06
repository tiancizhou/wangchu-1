import { Prisma } from '@prisma/client';
import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';
import { parseJsonArray, stringifyJson } from '../utils/jsonFields.js';

const router = Router();
router.use(requireAdmin);

type ProductGalleryItem = { imageUrl: string; caption: string };
type ProductPerformanceItem = { icon: string; title: string; description: string };

function createSlug(value: string) {
  return value.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function isUniqueSlugError(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002' && Array.isArray(err.meta?.target) && err.meta.target.includes('slug');
}

async function uniqueProductSlug(seed: string, currentProductId?: string) {
  const baseSlug = createSlug(seed) || `product-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.product.findFirst({ where: { slug, ...(currentProductId ? { NOT: { id: currentProductId } } : {}) } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function parseArray<T>(value: unknown, limit?: number) {
  const items = Array.isArray(value) ? value : [];
  return limit ? items.slice(0, limit) as T[] : items as T[];
}

function mapProduct(product: {
  detailGalleryJson: string;
  performanceItemsJson: string;
}) {
  return {
    ...product,
    detailGallery: parseJsonArray<ProductGalleryItem>(product.detailGalleryJson),
    performanceItems: parseJsonArray<ProductPerformanceItem>(product.performanceItemsJson)
  };
}

function productData(body: Record<string, unknown>, slug: string) {
  return {
    name: String(body.name || '').trim(),
    slug,
    categoryName: String(body.categoryName || '工业油品'),
    categoryId: body.categoryId ? String(body.categoryId) : null,
    coverImageUrl: String(body.coverImageUrl || ''),
    listCoverImageUrl: String(body.listCoverImageUrl || ''),
    topSubtitle: String(body.topSubtitle || ''),
    detailTitle: String(body.detailTitle || '产品详情'),
    detailDescription: String(body.detailDescription || ''),
    detailImageUrl: String(body.detailImageUrl || ''),
    productSpecsImageUrl: String(body.productSpecsImageUrl || ''),
    detailGalleryJson: stringifyJson(parseArray<ProductGalleryItem>(body.detailGallery, 6), []),
    performanceTitle: String(body.performanceTitle || '稳定的生产表现'),
    performanceText: String(body.performanceText || '公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。'),
    performanceItemsJson: stringifyJson(parseArray<ProductPerformanceItem>(body.performanceItems, 4), []),
    sortOrder: Number(body.sortOrder || 0),
    isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished)
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
  if (!body.name) {
    res.status(400).json({ message: '商品名称不能为空' });
    return;
  }

  try {
    const slug = await uniqueProductSlug(String(body.slug || body.name));
    const product = await prisma.product.create({ data: productData(body, slug), include: { categoryRef: true } });
    res.status(201).json(mapProduct(product));
  } catch (err) {
    if (isUniqueSlugError(err)) {
      res.status(409).json({ message: '网址标识已存在，请更换后重试' });
      return;
    }
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (!body.name) {
    res.status(400).json({ message: '商品名称不能为空' });
    return;
  }

  try {
    const slug = await uniqueProductSlug(String(body.slug || body.name), req.params.id);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: productData(body, slug),
      include: { categoryRef: true }
    });
    res.json(mapProduct(product));
  } catch (err) {
    if (isUniqueSlugError(err)) {
      res.status(409).json({ message: '网址标识已存在，请更换后重试' });
      return;
    }
    throw err;
  }
});

router.delete('/:id', async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
