import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../api/adminApi';

export function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>官网后台</h2>
        <Link to="/admin">控制台</Link>
        <Link to="/admin/products">商品管理</Link>
        <Link to="/admin/banners">轮播图管理</Link>
        <button onClick={onLogout}>退出登录</button>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
