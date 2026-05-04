import { Link } from 'react-router-dom';

const pages = [
  { title: '首页', description: '轮播图、服务优势、产品细项分类、荣誉资质、生产设计、制作工艺和关于我们预览。', to: '/admin/page/home' },
  { title: '产品中心', description: '产品列表、产品分类、加盟优势和加盟福利。', to: '/admin/page/products' },
  { title: '技术支持', description: '生产设计与制作模块的栏目、图片和说明。', to: '/admin/page/support' },
  { title: '渠道合作', description: '渠道合作页顾问信息和客户咨询记录。', to: '/admin/page/consult' },
  { title: '关于我们', description: '公司简介、基础信息和荣誉资质。', to: '/admin/page/about' }
];

export function DashboardPage() {
  return <section className="admin-panel"><div className="admin-title-block"><h1>控制台</h1><p>从左侧选择要编辑的网站页面。每个页面里会集中展示相关文字、图片、产品、资质或咨询记录，客户不需要理解数据库和技术字段。</p></div><div className="dashboard-page-grid">{pages.map((page) => <article className="dashboard-page-card" key={page.to}><h2>{page.title}</h2><p>{page.description}</p><Link to={page.to}>进入编辑</Link></article>)}</div></section>;
}
