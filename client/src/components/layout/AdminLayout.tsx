import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api/adminApi';

const links = [
  { to: '/admin', label: '控制台', end: true },
  { to: '/admin/page/home', label: '首页' },
  { to: '/admin/page/products', label: '产品中心' },
  { to: '/admin/page/consult', label: '渠道合作' }
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
