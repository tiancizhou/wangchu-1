import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';
import { parseJsonObject, stringifyJson } from '../utils/jsonFields.js';

const router = Router();
router.use(requireAdmin);

function mapSection(section: { dataJson: string }) {
  return {
    ...section,
    data: parseJsonObject<Record<string, unknown>>(section.dataJson, {})
  };
}

router.get('/', async (req, res) => {
  const pageKey = String(req.query.pageKey || '').trim();
  const sections = await prisma.contentSection.findMany({
    where: pageKey ? { pageKey } : {},
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
  });
  res.json(sections.map(mapSection));
});

router.get('/:pageKey/:sectionKey', async (req, res) => {
  const section = await prisma.contentSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: req.params.pageKey, sectionKey: req.params.sectionKey } }
  });

  if (!section) {
    res.status(404).json({ message: '内容区块不存在' });
    return;
  }

  res.json(mapSection(section));
});

router.put('/:pageKey/:sectionKey', async (req, res) => {
  const body = req.body;
  const section = await prisma.contentSection.upsert({
    where: { pageKey_sectionKey: { pageKey: req.params.pageKey, sectionKey: req.params.sectionKey } },
    update: {
      title: body.title || '',
      subtitle: body.subtitle || '',
      dataJson: stringifyJson(body.data || {}, {}),
      sortOrder: Number(body.sortOrder || 0),
      isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished)
    },
    create: {
      pageKey: req.params.pageKey,
      sectionKey: req.params.sectionKey,
      title: body.title || '',
      subtitle: body.subtitle || '',
      dataJson: stringifyJson(body.data || {}, {}),
      sortOrder: Number(body.sortOrder || 0),
      isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished)
    }
  });

  res.json(mapSection(section));
});

export default router;
