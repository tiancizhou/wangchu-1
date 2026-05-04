import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminProductsRoutes from './routes/admin.products.routes.js';
import adminBannersRoutes from './routes/admin.banners.routes.js';
import adminUploadsRoutes from './routes/admin.uploads.routes.js';
import adminSiteRoutes from './routes/admin.site.routes.js';
import adminCategoriesRoutes from './routes/admin.categories.routes.js';
import adminContentRoutes from './routes/admin.content.routes.js';
import adminCertificatesRoutes from './routes/admin.certificates.routes.js';
import adminConsultationsRoutes from './routes/admin.consultations.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const clientDir = path.join(rootDir, 'client');
const clientDistDir = path.join(clientDir, 'dist');
const isProduction = process.env.NODE_ENV === 'production';

export async function createApp() {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || `http://localhost:${process.env.PORT || 4000}`;

  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.use('/api', publicRoutes);
  app.use('/api/admin/auth', authRoutes);
  app.use('/api/admin/products', adminProductsRoutes);
  app.use('/api/admin/banners', adminBannersRoutes);
  app.use('/api/admin/uploads', adminUploadsRoutes);
  app.use('/api/admin', adminSiteRoutes);
  app.use('/api/admin/categories', adminCategoriesRoutes);
  app.use('/api/admin/content-sections', adminContentRoutes);
  app.use('/api/admin/certificates', adminCertificatesRoutes);
  app.use('/api/admin/consultations', adminConsultationsRoutes);

  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(400).json({ message: error.message || '请求处理失败' });
  });

  if (isProduction) {
    app.use(express.static(clientDistDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDistDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      root: clientDir,
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const indexPath = path.join(clientDir, 'index.html');
        const template = fs.readFileSync(indexPath, 'utf-8');
        const html = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  }

  return app;
}
