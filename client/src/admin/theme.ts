import type { ThemeConfig } from 'antd';

export const adminTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 10,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.06)',
    boxShadowSecondary: '0 6px 16px rgba(15, 23, 42, 0.08), 0 3px 6px rgba(15, 23, 42, 0.04)'
  },
  components: {
    Layout: {
      siderBg: '#fbfcfe',
      headerBg: '#ffffff',
      bodyBg: 'transparent',
      headerHeight: 56,
      headerPadding: '0 24px'
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemSelectedBg: 'rgba(22, 119, 255, 0.08)',
      itemSelectedColor: '#1677ff',
      itemHoverBg: 'rgba(22, 119, 255, 0.04)'
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 20
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#475569'
    },
    Button: {
      controlHeight: 36
    }
  }
};

export const adminPageBackground = 'linear-gradient(180deg, #f6f8fc 0%, #eef2f8 100%)';
