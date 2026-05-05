import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Outlet } from 'react-router-dom';
import { adminTheme } from './theme';

export function AdminApp() {
  return (
    <ConfigProvider theme={adminTheme} locale={zhCN}>
      <AntdApp>
        <Outlet />
      </AntdApp>
    </ConfigProvider>
  );
}
