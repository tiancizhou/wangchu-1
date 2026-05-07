import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';
import { parseJsonArray, stringifyJson } from '../utils/jsonFields.js';

const router = Router();
router.use(requireAdmin);

function mapSiteProfile<T extends { footerLinksJson: string; footerLogoUrl?: string } | null>(profile: T) {
  return profile ? { ...profile, footerLogoUrl: profile.footerLogoUrl || '', footerLinks: parseJsonArray(profile.footerLinksJson, []) } : null;
}

router.get('/site-profile', async (_req, res) => {
  res.json(mapSiteProfile(await prisma.siteProfile.findFirst()));
});

router.put('/site-profile', async (req, res) => {
  const body = req.body;
  const existing = await prisma.siteProfile.findFirst();
  const data = {
    companyName: body.companyName || '桔尔润（北京）润滑油有限公司',
    logoUrl: body.logoUrl || '',
    footerLogoUrl: body.footerLogoUrl || '',
    phone: body.phone || '',
    hotline: body.hotline || '',
    address: body.address || '',
    email: body.email || '',
    footerText: body.footerText || '',
    footerLinksJson: stringifyJson((Array.isArray(body.footerLinks) ? body.footerLinks : parseJsonArray(body.footerLinksJson, [])).slice(0, 4), []),
    footerLinkTitle: body.footerLinkTitle || '友情链接：',
    legalLabel: body.legalLabel || '法律声明',
    legalUrl: body.legalUrl || '/legal',
    contactLabel: body.contactLabel || '联系我们',
    contactUrl: body.contactUrl || '/contact',
    copyrightText: body.copyrightText || '',
    policeFilingText: body.policeFilingText || '',
    policeFilingUrl: body.policeFilingUrl || '',
    icpText: body.icpText || '',
    icpUrl: body.icpUrl || '',
    seoTitle: body.seoTitle || '',
    seoDescription: body.seoDescription || ''
  };

  const siteProfile = existing
    ? await prisma.siteProfile.update({ where: { id: existing.id }, data })
    : await prisma.siteProfile.create({ data });

  res.json(mapSiteProfile(siteProfile));
});

router.get('/navigation', async (_req, res) => {
  const items = await prisma.navigationItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  res.json(items);
});

router.post('/navigation', async (req, res) => {
  const body = req.body;
  if (!body.label || !body.url) {
    res.status(400).json({ message: '菜单名称和链接不能为空' });
    return;
  }

  const item = await prisma.navigationItem.create({
    data: {
      label: body.label,
      url: body.url,
      sortOrder: Number(body.sortOrder || 0),
      isVisible: body.isVisible === undefined ? true : Boolean(body.isVisible),
      openInNewTab: Boolean(body.openInNewTab)
    }
  });
  res.status(201).json(item);
});

router.put('/navigation/:id', async (req, res) => {
  const body = req.body;
  const item = await prisma.navigationItem.update({
    where: { id: req.params.id },
    data: {
      label: body.label,
      url: body.url,
      sortOrder: Number(body.sortOrder || 0),
      isVisible: Boolean(body.isVisible),
      openInNewTab: Boolean(body.openInNewTab)
    }
  });
  res.json(item);
});

router.delete('/navigation/:id', async (req, res) => {
  await prisma.navigationItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
