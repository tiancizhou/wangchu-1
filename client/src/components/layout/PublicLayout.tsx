import { Link, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">K</span>
          <span><b>Kronprins</b><small>王储</small></span>
        </Link>
        <nav>
          <Link to="/">首页</Link>
          <Link to="/products">产品中心</Link>
          <a href="/#support">技术支持</a>
          <Link to="/consult">渠道合作</Link>
          <a href="/#about">关于我们</a>
        </nav>
        <div className="phone">☎ 0519-68288220</div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="brand footer-brand"><span className="brand-mark">K</span><span><b>Kronprins</b><small>王储</small></span></div>
        <p>稼尔润（北京）润滑油有限公司　全国服务热线：0519-68288220</p>
        <p>首页 | 产品中心 | 技术支持 | 渠道合作 | 关于我们</p>
      </footer>
    </>
  );
}
