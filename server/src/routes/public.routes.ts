import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { parseJsonArray, parseJsonObject } from '../utils/jsonFields.js';

const router = Router();

type JsonRecord = Record<string, unknown>;

type FooterLink = { label: string; url: string };

function mapSiteProfile(profile: Awaited<ReturnType<typeof getSiteProfile>>) {
  return profile ? { ...profile, footerLogoUrl: profile.footerLogoUrl || '', footerLinks: parseJsonArray<FooterLink>(profile.footerLinksJson, []) } : null;
}

function mapProduct(product: {
  detailGalleryJson: string;
  performanceItemsJson: string;
}) {
  return {
    ...product,
    detailGallery: parseJsonArray<JsonRecord>(product.detailGalleryJson),
    performanceItems: parseJsonArray<JsonRecord>(product.performanceItemsJson)
  };
}

function mapSection(section: { dataJson: string }) {
  return {
    ...section,
    data: parseJsonObject<JsonRecord>(section.dataJson, {})
  };
}

async function getSiteProfile() {
  return prisma.siteProfile.findFirst();
}

async function getNavigation() {
  return prisma.navigationItem.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
  });
}

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/site-profile', async (_req, res) => {
  res.json(mapSiteProfile(await getSiteProfile()));
});

router.get('/navigation', async (_req, res) => {
  res.json(await getNavigation());
});

router.get('/banners', async (_req, res) => {
  const banners = await prisma.carouselBanner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(banners);
});

router.get('/categories', async (_req, res) => {
  const categories = await prisma.productCategory.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
  });
  res.json(categories);
});

router.get('/certificates', async (_req, res) => {
  const certificates = await prisma.certificate.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  });
  res.json(certificates);
});

router.get('/content-sections', async (req, res) => {
  const pageKey = String(req.query.pageKey || '').trim();
  if (!pageKey) {
    res.status(400).json({ message: '缺少页面标识' });
    return;
  }

  const sections = await prisma.contentSection.findMany({
    where: { pageKey, isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
  });
  res.json(Object.fromEntries(sections.map((section) => [section.sectionKey, mapSection(section)])));
});

router.get('/home', async (_req, res) => {
  const [siteProfile, navigation, banners, categories, products, sections] = await Promise.all([
    getSiteProfile(),
    getNavigation(),
    prisma.carouselBanner.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }),
    prisma.productCategory.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.product.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 6 }),
    prisma.contentSection.findMany({ where: { pageKey: 'home', isPublished: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] })
  ]);

  res.json({
    siteProfile: mapSiteProfile(siteProfile),
    navigation,
    banners,
    categories,
    products: products.map(mapProduct),
    sections: Object.fromEntries(sections.map((section) => [section.sectionKey, mapSection(section)]))
  });
});

router.get('/products', async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 12), 1), 50);
  const keyword = String(req.query.keyword || '').trim();
  const category = String(req.query.category || '').trim();
  const categoryRow = category ? await prisma.productCategory.findFirst({ where: { OR: [{ slug: category }, { name: category }] } }) : null;
  const where = {
    isPublished: true,
    ...(keyword ? { name: { contains: keyword } } : {}),
    ...(category ? categoryRow ? { categoryId: categoryRow.id } : { categoryName: category } : {})
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { categoryRef: true },
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
    where: { slug: req.params.slug, isPublished: true },
    include: { categoryRef: true }
  });

  if (!product) {
    res.status(404).json({ message: '商品不存在' });
    return;
  }

  res.json(mapProduct(product));
});

router.post('/consultations', async (req, res) => {
  const { name, phone, industry, message, sourcePage } = req.body as {
    name?: string;
    phone?: string;
    industry?: string;
    message?: string;
    sourcePage?: string;
  };

  if (!name?.trim() || !phone?.trim()) {
    res.status(400).json({ message: '请填写姓名和手机号' });
    return;
  }

  const submission = await prisma.consultationSubmission.create({
    data: {
      name: name.trim(),
      phone: phone.trim(),
      industry: industry?.trim() || '',
      message: message?.trim() || '',
      sourcePage: sourcePage?.trim() || ''
    }
  });

  res.status(201).json({ id: submission.id, ok: true });
});

export default router;
