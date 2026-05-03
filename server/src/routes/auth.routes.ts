import { Router } from 'express';
import { prisma } from '../prisma/client.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { signAdminToken, verifyPassword } from '../utils/auth.js';

const router = Router();
const cookieName = process.env.COOKIE_NAME || 'admin_session';

router.post('/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ message: '请输入账号和密码' });
    return;
  }

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    res.status(401).json({ message: '账号或密码错误' });
    return;
  }

  const token = signAdminToken({ id: admin.id, username: admin.username, role: admin.role });
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ id: admin.id, username: admin.username, role: admin.role });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json(req.admin);
});

router.post('/logout', (_req, res) => {
  res.clearCookie(cookieName);
  res.json({ ok: true });
});

export default router;
