import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res) => {
  const certificates = await prisma.certificate.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  res.json(certificates);
});

router.post('/', async (req, res) => {
  const body = req.body;
  if (!body.title) {
    res.status(400).json({ message: '证书名称不能为空' });
    return;
  }

  const certificate = await prisma.certificate.create({
    data: {
      title: body.title,
      category: body.category || '',
      imageUrl: body.imageUrl || '',
      description: body.description || '',
      issuer: body.issuer || '',
      issueDate: body.issueDate || '',
      sortOrder: Number(body.sortOrder || 0),
      isPublished: body.isPublished === undefined ? true : Boolean(body.isPublished)
    }
  });
  res.status(201).json(certificate);
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  const certificate = await prisma.certificate.update({
    where: { id: req.params.id },
    data: {
      title: body.title,
      category: body.category || '',
      imageUrl: body.imageUrl || '',
      description: body.description || '',
      issuer: body.issuer || '',
      issueDate: body.issueDate || '',
      sortOrder: Number(body.sortOrder || 0),
      isPublished: Boolean(body.isPublished)
    }
  });
  res.json(certificate);
});

router.delete('/:id', async (req, res) => {
  await prisma.certificate.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
