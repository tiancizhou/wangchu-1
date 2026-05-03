import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

export type AdminToken = {
  id: string;
  username: string;
  role: string;
};

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: AdminToken) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, jwtSecret) as AdminToken;
}
