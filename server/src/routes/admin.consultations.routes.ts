import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { prisma } from '../prisma/client.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (req, res) => {
  const status = String(req.query.status || '').trim();
  const submissions = await prisma.consultationSubmission.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: 'desc' }
  });
  res.json(submissions);
});

router.get('/:id', async (req, res) => {
  const submission = await prisma.consultationSubmission.findUnique({ where: { id: req.params.id } });
  if (!submission) {
    res.status(404).json({ message: '咨询记录不存在' });
    return;
  }
  res.json(submission);
});

router.put('/:id', async (req, res) => {
  const body = req.body;
  const submission = await prisma.consultationSubmission.update({
    where: { id: req.params.id },
    data: {
      status: body.status || 'new',
      adminNote: body.adminNote || ''
    }
  });
  res.json(submission);
});

export default router;
