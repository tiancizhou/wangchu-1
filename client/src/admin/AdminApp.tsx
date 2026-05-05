import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { adminTheme } from './theme';

const desktopViewport = 'width=1280, initial-scale=1.0';
const defaultViewport = 'width=device-width, initial-scale=1.0';

export function AdminApp() {
  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const previousContent = viewport?.content;

    if (viewport) viewport.content = desktopViewport;

    return () => {
      if (viewport) viewport.content = previousContent || defaultViewport;
    };
  }, []);

  return (
    <ConfigProvider theme={adminTheme} locale={zhCN}>
      <AntdApp>
        <Outlet />
      </AntdApp>
    </ConfigProvider>
  );
}
