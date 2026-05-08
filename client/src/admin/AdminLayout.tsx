import { useState } from 'react';
import { Layout, Menu, Breadcrumb, Dropdown, Button, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  LayoutOutlined,
  PictureOutlined,
  AppstoreOutlined,
  ToolOutlined,
  BulbOutlined,
  TeamOutlined,
  LinkOutlined,
  BankOutlined,
  ShoppingOutlined,
  SafetyCertificateOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../api/adminApi';
import { adminPageBackground } from './theme';

const { Sider, Header, Content } = Layout;

type MenuEntry = { key: string; label: string; icon: React.ReactNode };

const menuGroups: { key: string; label: string; items: MenuEntry[] }[] = [
  {
    key: 'content',
    label: '内容编辑',
    items: [
      { key: '/admin/navigation', label: '页面导航', icon: <LinkOutlined /> },
      { key: '/admin/banners', label: '轮播图管理', icon: <PictureOutlined /> },
      { key: '/admin/page/enterprise', label: '企业管理模块', icon: <AppstoreOutlined /> },
      { key: '/admin/page/support', label: '生产设计与制作', icon: <ToolOutlined /> },
      { key: '/admin/page/support-secondary', label: '技术支持二级页面', icon: <ToolOutlined /> },
      { key: '/admin/page/process', label: '先进的制作工艺', icon: <BulbOutlined /> },
      { key: '/admin/page/about', label: '关于我们', icon: <TeamOutlined /> },
      { key: '/admin/page/consult', label: '渠道合作', icon: <MessageOutlined /> },
      { key: '/admin/page/legal', label: '法律声明', icon: <SafetyCertificateOutlined /> },
      { key: '/admin/page/contact', label: '联系我们', icon: <MessageOutlined /> },
      { key: '/admin/site', label: '页脚', icon: <BankOutlined /> }
    ]
  },
  {
    key: 'data',
    label: '数据管理',
    items: [
      { key: '/admin/products', label: '产品管理', icon: <ShoppingOutlined /> },
      { key: '/admin/certificates', label: '荣誉资质', icon: <SafetyCertificateOutlined /> },
      { key: '/admin/consultations', label: '咨询记录', icon: <MessageOutlined /> }
    ]
  }
];

const dashboardKey = '/admin';
const dashboardEntry: MenuEntry = { key: dashboardKey, label: '编辑目录', icon: <LayoutOutlined /> };

const menuItems: MenuProps['items'] = [
  { type: 'item', key: dashboardEntry.key, label: dashboardEntry.label, icon: dashboardEntry.icon },
  ...menuGroups.map((group) => ({
    type: 'group' as const,
    key: group.key,
    label: group.label,
    children: group.items.map((item) => ({ key: item.key, label: item.label, icon: item.icon }))
  }))
];

function findMenuTitle(pathname: string): string {
  if (pathname === dashboardKey || pathname === `${dashboardKey}/`) return dashboardEntry.label;
  for (const group of menuGroups) {
    const match = group.items.find((item) => pathname.startsWith(item.key));
    if (match) return match.label;
  }
  if (pathname.startsWith('/admin/products')) return '产品管理';
  return '后台';
}

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function onLogout() {
    await logout();
    navigate('/admin/login');
  }

  const currentTitle = findMenuTitle(location.pathname);
  const selectedKeys = [
    dashboardEntry,
    ...menuGroups.flatMap((group) => group.items)
  ]
    .filter((item) => location.pathname === item.key || (item.key !== dashboardKey && location.pathname.startsWith(item.key)))
    .map((item) => item.key);

  const userMenu: MenuProps['items'] = [
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: onLogout }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: adminPageBackground }}>
      <Sider collapsible collapsed={collapsed} trigger={null} width={240} collapsedWidth={72} style={{ borderRight: '1px solid #eef2f8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 16px', color: '#0f172a' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>W</div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>官网后台</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Fluent Control</div>
            </div>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={(info) => navigate(info.key)}
          style={{ borderInlineEnd: 'none', paddingBlock: 4 }}
        />
      </Sider>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #eef2f8' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed((value) => !value)} />
          <Breadcrumb items={[{ title: '后台' }, { title: currentTitle }]} />
          <div style={{ flex: 1 }} />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar size={32} icon={<UserOutlined />} />
              <span style={{ color: '#475569' }}>管理员</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
