import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api/adminApi';

const links: { to: string; label: string; end?: boolean }[] = [
  { to: '/admin/navigation', label: '页面导航' },
  { to: '/admin/banners', label: '轮播图管理' },
  { to: '/admin/page/enterprise', label: '企业管理模块' },
  { to: '/admin/page/support', label: '生产设计与制作' },
  { to: '/admin/categories', label: '产品细项分类' },
  { to: '/admin/page/process', label: '先进的制作工艺' },
  { to: '/admin/page/about', label: '关于我们' },
  { to: '/admin/certificates', label: '荣誉资质' },
  { to: '/admin/site', label: '页脚' },
  { to: '/admin/products', label: '产品编辑' }
];

export function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>W</span>
          <div><h2>官网后台</h2><small>Fluent Control</small></div>
        </div>
        <nav className="admin-sidebar-nav">
          {links.map((link) => <NavLink end={link.end} to={link.to} className={({ isActive }) => isActive ? 'active' : ''} key={link.to}>{link.label}</NavLink>)}
        </nav>
        <button className="admin-logout" onClick={onLogout}>退出登录</button>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
