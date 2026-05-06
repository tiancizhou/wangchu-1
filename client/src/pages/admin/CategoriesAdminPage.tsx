import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Space, Switch, Tag, Typography } from 'antd';
import { adminCategories, deleteCategory, saveCategory } from '../../api/adminApi';
import type { ProductCategory } from '../../api/publicApi';
import { ConfirmButton, DragHandle, DraggableList, Dropzone, PageHeader, SectionCard } from '../../admin/components';

const emptyCategory: Partial<ProductCategory> = { name: '', slug: '', description: '', coverImageUrl: '', iconImageUrl: '', sortOrder: 0, isPublished: true };

type CategoriesAdminPageProps = {
  embedded?: boolean;
};

export function CategoriesAdminPage({ embedded = false }: CategoriesAdminPageProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [editing, setEditing] = useState<Partial<ProductCategory>>(emptyCategory);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<Partial<ProductCategory>>();
  const { message } = App.useApp();

  async function load() {
    setLoading(true);
    try {
      setCategories(await adminCategories());
    } catch (err) {
      message.error(err instanceof Error ? err.message : '分类加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { form.setFieldsValue(editing); }, [editing, form]);

  async function onSubmit(values: Partial<ProductCategory>) {
    setSaving(true);
    try {
      const saved = await saveCategory({ ...editing, ...values });
      setEditing(saved);
      message.success('分类已保存');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '分类保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(category: ProductCategory) {
    try {
      await deleteCategory(category.id);
      if (editing.id === category.id) setEditing({ ...emptyCategory });
      message.success('分类已删除');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '分类删除失败');
    }
  }

  function startCreate() {
    setEditing({ ...emptyCategory });
    form.resetFields();
  }

  function reorderCategories(next: ProductCategory[]) {
    setCategories(next.map((category, index) => ({ ...category, sortOrder: index + 1 })));
  }

  async function saveCategoryOrder() {
    setSaving(true);
    try {
      await Promise.all(categories.map((category) => saveCategory(category)));
      message.success('分类排序已保存');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '分类排序保存失败');
    } finally {
      setSaving(false);
    }
  }

  const isEditingExisting = Boolean(editing.id);

  const actions = <><Button onClick={saveCategoryOrder} loading={saving}>保存排序</Button><Button type="primary" onClick={startCreate}>新建分类</Button></>;

  return (
    <div>
      {!embedded && <PageHeader title="产品细项分类" description="维护产品中心的细项分类入口、排序、封面图和发布状态。" extra={actions} />}
      {embedded && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>{actions}</div>}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="选择分类">
            {loading && <Typography.Text type="secondary">分类加载中...</Typography.Text>}
            {!loading && categories.length === 0 && <Typography.Text type="secondary">还没有分类，请先新建。</Typography.Text>}
            <DraggableList
              items={categories}
              getItemId={(category) => category.id}
              onReorder={reorderCategories}
              renderItem={(category, index, dragHandle) => (
                <Card size="small" onClick={() => setEditing(category)} style={{ cursor: 'pointer', borderColor: editing.id === category.id ? '#1677ff' : undefined }}>
                  <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space><DragHandle dragHandle={dragHandle} /><Typography.Text>{index + 1}</Typography.Text><div><Typography.Text strong>{category.name}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>{category.slug || '未填写链接标识'}</Typography.Text></div></Space>
                    <Tag color={category.isPublished ? 'success' : 'default'}>{category.isPublished ? '显示' : '隐藏'}</Tag>
                  </Space>
                </Card>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <SectionCard title={isEditingExisting ? '编辑分类详情' : '新建分类'} defaultCollapsed={false} status={editing.isPublished ? 'active' : 'hidden'}>
            <Form form={form} layout="vertical" initialValues={emptyCategory} onFinish={onSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12}><Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请填写分类名称' }]}><Input placeholder="例如 汽油机油" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="slug" label="链接标识"><Input placeholder="例如 gasoline-oil" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="sortOrder" label="显示排序"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="isPublished" label="前台显示" valuePropName="checked"><Switch /></Form.Item></Col>
              </Row>
              <Form.Item name="description" label="分类描述"><Input.TextArea rows={4} placeholder="简要说明这个分类下包含哪些产品" /></Form.Item>
              <Form.Item name="coverImageUrl" label="分类封面图"><Dropzone value={form.getFieldValue('coverImageUrl')} cropPreset="productCategoryCover" onChange={(url) => form.setFieldValue('coverImageUrl', url)} /></Form.Item>
              <Space>
                {isEditingExisting && <ConfirmButton danger title={`确定删除“${editing.name}”这个分类吗？`} onConfirm={() => onDelete(editing as ProductCategory)}>删除当前分类</ConfirmButton>}
                <Button type="primary" htmlType="submit" loading={saving}>{isEditingExisting ? '保存分类修改' : '新增分类'}</Button>
              </Space>
            </Form>
          </SectionCard>
        </Col>
      </Row>
    </div>
  );
}
