import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AdminApp } from './admin/AdminApp';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { PublicLayout } from './components/layout/PublicLayout';
import { CertificatesPage } from './pages/CertificatesPage';
import { ConsultPage } from './pages/ConsultPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { BannersAdminPage } from './pages/admin/BannersAdminPage';
import { CategoriesAdminPage } from './pages/admin/CategoriesAdminPage';
import { CertificatesAdminPage } from './pages/admin/CertificatesAdminPage';
import { ConsultationsAdminPage } from './pages/admin/ConsultationsAdminPage';
import { ContentSectionsAdminPage } from './pages/admin/ContentSectionsAdminPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { LoginPage } from './pages/admin/LoginPage';
import { NavigationAdminPage } from './pages/admin/NavigationAdminPage';
import { PageEditorAdminPage } from './pages/admin/PageEditorAdminPage';
import { ProductEditPage } from './pages/admin/ProductEditPage';
import { ProductsAdminPage } from './pages/admin/ProductsAdminPage';
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage';

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
  {
    element: <AdminApp />,
    children: [
      { path: '/admin/login', element: <LoginPage /> },
      {
        path: '/admin',
        element: <ProtectedRoute />,
        children: [{ element: <AdminLayout />, children: [
          { index: true, element: <DashboardPage /> },
          { path: 'page/:page', element: <PageEditorAdminPage /> },
          { path: 'site', element: <SiteSettingsPage /> },
          { path: 'navigation', element: <NavigationAdminPage /> },
          { path: 'content', element: <ContentSectionsAdminPage /> },
          { path: 'categories', element: <CategoriesAdminPage /> },
          { path: 'products', element: <ProductsAdminPage /> },
          { path: 'products/new', element: <ProductEditPage /> },
          { path: 'products/:id/edit', element: <ProductEditPage /> },
          { path: 'banners', element: <BannersAdminPage /> },
          { path: 'certificates', element: <CertificatesAdminPage /> },
          { path: 'consultations', element: <ConsultationsAdminPage /> }
        ] }]
      }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
