import { Link } from 'react-router-dom';

const pages = [
  { title: '页面导航', description: '维护网站顶部导航菜单的名称、链接和显示顺序。', to: '/admin/navigation' },
  { title: '轮播图管理', description: '上传和排序首页顶部展示的图片、动图或视频。', to: '/admin/banners' },
  { title: '企业管理模块', description: '编辑首页企业管理模块中的卡片、图标、说明和跳转入口。', to: '/admin/page/enterprise' },
  { title: '生产设计与制作', description: '编辑首页生产设计与制作区域的栏目、主图、说明和底部轮播图片。', to: '/admin/page/support' },
  { title: '产品细项分类', description: '维护产品分类入口、封面图、说明和显示顺序。', to: '/admin/categories' },
  { title: '先进的制作工艺', description: '编辑首页先进的制作工艺区域的背景图、项目图片和说明。', to: '/admin/page/process' },
  { title: '关于我们', description: '编辑首页关于我们区域的公司简介和展示图片。', to: '/admin/page/about' },
  { title: '荣誉资质', description: '上传和维护网站展示的证书、资质和荣誉图片。', to: '/admin/certificates' },
  { title: '页脚', description: '维护页脚公司信息、联系方式、友情链接和备案信息。', to: '/admin/site' },
  { title: '产品编辑', description: '新增、编辑和管理前台展示的产品。', to: '/admin/products' }
];

export function DashboardPage() {
  return <section className="admin-panel"><div className="admin-title-block"><h1>编辑目录</h1><p>从左侧或下方选择要编辑的网站内容模块。每个入口对应客户可理解的页面区域或内容模块。</p></div><div className="dashboard-page-grid">{pages.map((page) => <article className="dashboard-page-card" key={page.to}><h2>{page.title}</h2><p>{page.description}</p><Link to={page.to}>进入编辑</Link></article>)}</div></section>;
}
