import 'dotenv/config';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminProductsRoutes from './routes/admin.products.routes.js';
import adminBannersRoutes from './routes/admin.banners.routes.js';
import adminUploadsRoutes from './routes/admin.uploads.routes.js';

export const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api', publicRoutes);
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/banners', adminBannersRoutes);
app.use('/api/admin/uploads', adminUploadsRoutes);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(400).json({ message: error.message || '请求处理失败' });
});
