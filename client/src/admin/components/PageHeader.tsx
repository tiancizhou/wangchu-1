import { Button, Space, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  publicLocation?: string;
  extra?: ReactNode;
};

export function PageHeader({ title, description, publicLocation, extra }: Props) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>
        {description && <Typography.Paragraph type="secondary" style={{ marginTop: 6, marginBottom: 0 }}>{description}</Typography.Paragraph>}
        {publicLocation && (
          <Typography.Text type="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, marginTop: 6 }}>
            <LinkOutlined />前台位置：
            <a href={publicLocation} target="_blank" rel="noreferrer">{publicLocation}</a>
          </Typography.Text>
        )}
      </div>
      {extra && <Space>{extra}</Space>}
    </div>
  );
}

export { Button as PageHeaderButton };
