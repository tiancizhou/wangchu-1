import { Table, Input, Space, Empty, Typography } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useMemo, useState, type ReactNode } from 'react';

type Props<T> = {
  columns: TableProps<T>['columns'];
  data: T[];
  rowKey: keyof T | ((record: T) => string);
  searchableKeys?: (keyof T)[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  pagination?: TableProps<T>['pagination'];
  empty?: ReactNode;
};

export function SearchableTable<T extends object>({ columns, data, rowKey, searchableKeys, searchPlaceholder = '搜索', toolbar, pagination, empty }: Props<T>) {
  const [keyword, setKeyword] = useState('');

  const filtered = useMemo(() => {
    if (!keyword || !searchableKeys || searchableKeys.length === 0) return data;
    const needle = keyword.toLowerCase();
    return data.filter((record) => searchableKeys.some((key) => String(record[key] ?? '').toLowerCase().includes(needle)));
  }, [data, keyword, searchableKeys]);

  function getKey(record: T): string {
    if (typeof rowKey === 'function') return rowKey(record);
    return String(record[rowKey]);
  }

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
        {searchableKeys && searchableKeys.length > 0 ? (
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={searchPlaceholder}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 260 }}
          />
        ) : <span />}
        {toolbar}
      </Space>
      {filtered.length === 0 ? (
        empty || <Empty description="暂无数据" />
      ) : (
        <Table<T>
          columns={columns}
          dataSource={filtered}
          rowKey={(record) => getKey(record)}
          pagination={pagination ?? { pageSize: 20, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
        />
      )}
      {filtered.length > 0 && <Typography.Text type="secondary" style={{ fontSize: 12 }}>共 {filtered.length} 条</Typography.Text>}
    </Space>
  );
}
