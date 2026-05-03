import type { NextFunction, Request, Response } from 'express';
import { verifyAdminToken, type AdminToken } from '../utils/auth.js';

const cookieName = process.env.COOKIE_NAME || 'admin_session';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminToken;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[cookieName];

  if (!token) {
    res.status(401).json({ message: '请先登录' });
    return;
  }

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ message: '登录已过期，请重新登录' });
  }
}
