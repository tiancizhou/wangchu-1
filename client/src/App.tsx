import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { CertificatesPage } from './pages/CertificatesPage';
import { ConsultPage } from './pages/ConsultPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { BannersAdminPage } from './pages/admin/BannersAdminPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { LoginPage } from './pages/admin/LoginPage';
import { ProductEditPage } from './pages/admin/ProductEditPage';
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'consult', element: <ConsultPage /> },
      { path: 'certificates', element: <CertificatesPage /> }
    ]
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [{ element: <AdminLayout />, children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsAdminPage /> },
      { path: 'products/new', element: <ProductEditPage /> },
      { path: 'products/:id/edit', element: <ProductEditPage /> },
      { path: 'banners', element: <BannersAdminPage /> }
    ] }]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
