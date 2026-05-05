import { Card, Tag, Typography, Space } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { useState, type ReactNode, useEffect } from 'react';

type Status = 'active' | 'hidden';

type Props = {
  title: string;
  description?: string;
  status?: Status;
  extra?: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children: ReactNode;
};

function statusTag(status?: Status) {
  if (status === 'active') return <Tag color="success">显示中</Tag>;
  if (status === 'hidden') return <Tag>已隐藏</Tag>;
  return null;
}

export function SectionCard({ title, description, status, extra, defaultCollapsed = true, collapsed: controlled, onCollapsedChange, children }: Props) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const collapsed = controlled ?? internal;

  useEffect(() => {
    if (controlled !== undefined) setInternal(controlled);
  }, [controlled]);

  function toggle() {
    const next = !collapsed;
    if (controlled === undefined) setInternal(next);
    onCollapsedChange?.(next);
  }

  return (
    <Card bordered style={{ width: '100%' }} styles={{ body: { padding: collapsed ? 0 : 20 } }}>
      <div onClick={toggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggle(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, cursor: 'pointer' }}>
        <CaretRightOutlined style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s', color: '#94a3b8' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Space size={8} align="center" wrap>
            <Typography.Text strong>{title}</Typography.Text>
            {statusTag(status)}
          </Space>
          {description && <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 2, fontSize: 12 }}>{description}</Typography.Paragraph>}
        </div>
        {extra && <Space onClick={(e) => e.stopPropagation()}>{extra}</Space>}
      </div>
      {!collapsed && (
        <div style={{ borderTop: '1px solid #eef2f8', padding: 20 }}>
          {children}
        </div>
      )}
    </Card>
  );
}
