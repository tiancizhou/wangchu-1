import { useEffect, useState } from 'react';
import { App, Button, Card, Form, Input, InputNumber, Space, Switch, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminNavigation, deleteNavigationItem, saveNavigationItem } from '../../api/adminApi';
import type { NavigationItem } from '../../api/publicApi';
import { ConfirmButton, PageHeader, SearchableTable } from '../../admin/components';

const emptyItem: Partial<NavigationItem> = { label: '', url: '', sortOrder: 0, isVisible: true, openInNewTab: false };

export function NavigationAdminPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [editing, setEditing] = useState<Partial<NavigationItem>>(emptyItem);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<Partial<NavigationItem>>();
  const { message } = App.useApp();

  async function load() { setItems(await adminNavigation()); }

  useEffect(() => { load(); }, []);
  useEffect(() => { form.setFieldsValue(editing); }, [editing, form]);

  async function onSubmit(values: Partial<NavigationItem>) {
    setSaving(true);
    try {
      await saveNavigationItem({ ...editing, ...values });
      message.success('菜单已保存');
      setEditing({ ...emptyItem });
      form.resetFields();
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '菜单保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    try {
      await deleteNavigationItem(id);
      message.success('菜单已删除');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '菜单删除失败');
    }
  }

  const columns: ColumnsType<NavigationItem> = [
    { title: '名称', dataIndex: 'label', sorter: (a, b) => a.label.localeCompare(b.label) },
    { title: '链接', dataIndex: 'url' },
    { title: '排序', dataIndex: 'sortOrder', sorter: (a, b) => a.sortOrder - b.sortOrder },
    { title: '显示', dataIndex: 'isVisible', render: (value: boolean) => value ? <Tag color="success">显示</Tag> : <Tag>隐藏</Tag> },
    {
      title: '操作',
      render: (_, item) => (
        <Space>
          <Button size="small" onClick={() => setEditing(item)}>编辑</Button>
          <ConfirmButton size="small" danger title={`确定删除“${item.label}”吗？`} onConfirm={() => onDelete(item.id)}>删除</ConfirmButton>
        </Space>
      )
    }
  ];

  return (
    <div>
      <PageHeader title="页面导航" description="维护网站顶部导航菜单的名称、链接和显示顺序。" />
      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" initialValues={emptyItem} onFinish={onSubmit}>
          <Form.Item name="label" label="菜单名称" rules={[{ required: true, message: '请填写菜单名称' }]}><Input placeholder="例如：首页" /></Form.Item>
          <Form.Item name="url" label="链接地址" rules={[{ required: true, message: '请填写链接地址' }]}><Input placeholder="例如：/products" /></Form.Item>
          <Form.Item name="sortOrder" label="排序"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Space wrap>
            <Form.Item name="isVisible" label="显示" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="openInNewTab" label="新窗口打开" valuePropName="checked"><Switch /></Form.Item>
          </Space>
          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>保存菜单</Button>
            <Button onClick={() => { setEditing({ ...emptyItem }); form.resetFields(); }}>新建菜单</Button>
          </Space>
        </Form>
      </Card>
      <Card title="导航列表">
        <SearchableTable columns={columns} data={items} rowKey="id" searchableKeys={['label', 'url']} searchPlaceholder="搜索菜单名称或链接" />
      </Card>
    </div>
  );
}
