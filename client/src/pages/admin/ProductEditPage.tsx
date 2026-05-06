import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd';
import { adminCategories, adminProduct, saveProduct } from '../../api/adminApi';
import type { Product, ProductCategory, ProductGalleryItem, ProductPerformanceItem } from '../../api/publicApi';
import { ConfirmButton, Dropzone, PageHeader, SectionCard, SectionCardGroup } from '../../admin/components';

const defaultPerformanceTitle = '稳定的生产表现';
const defaultPerformanceText = '公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。';

const emptyProduct: Partial<Product> = {
  name: '', slug: '', categoryName: '工业油品', categoryId: '', coverImageUrl: '', listCoverImageUrl: '', topSubtitle: '', detailTitle: '', detailDescription: '', detailImageUrl: '', productSpecsImageUrl: '', detailGallery: [], performanceTitle: defaultPerformanceTitle, performanceText: defaultPerformanceText, performanceItems: [], sortOrder: 0, isPublished: true
};

function createSlug(value: string) {
  return value.toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function ProductEditPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Partial<Product>>(emptyProduct);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<Partial<Product>>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const rows = await adminCategories();
        setCategories(rows);
        const data = id ? { ...emptyProduct, ...(await adminProduct(id)) } : { ...emptyProduct, categoryId: rows[0]?.id || '', categoryName: rows[0]?.name || '工业油品' };
        setProduct(data);
        form.setFieldsValue(data);
      } catch (err) {
        message.error(err instanceof Error ? err.message : '产品信息加载失败');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, form, message]);

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }));
    form.setFieldValue(key, value);
  }

  function updateGallery(index: number, patch: Partial<ProductGalleryItem>) {
    const nextItems = [...(product.detailGallery || [])];
    nextItems[index] = { ...nextItems[index], ...patch };
    setField('detailGallery', nextItems);
  }

  function updatePerformanceItem(index: number, patch: Partial<ProductPerformanceItem>) {
    const nextItems = [...(product.performanceItems || [])];
    nextItems[index] = { ...nextItems[index], ...patch };
    setField('performanceItems', nextItems);
  }

  async function onSubmit(values: Partial<Product>) {
    setSaving(true);
    try {
      const category = categories.find((item) => item.id === values.categoryId);
      const slug = values.slug?.trim() || createSlug(values.name || '') || `product-${Date.now()}`;
      await saveProduct({ ...product, ...values, slug, categoryName: category?.name || product.categoryName || '工业油品' });
      message.success('产品已保存');
      navigate('/admin/products');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '产品保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  const detailGallery = product.detailGallery || [];
  const performanceItems = product.performanceItems || [];
  const saveText = id ? '保存修改' : '创建产品';

  return (
    <div>
      <PageHeader title={id ? '编辑产品' : '新建产品'} description="按照前台详情页区块顺序维护产品信息、图片、参数和生产表现。" extra={<Button onClick={() => navigate('/admin/products')}>返回产品列表</Button>} />
      {loading ? <Card><Typography.Text type="secondary">产品信息加载中...</Typography.Text></Card> : (
        <Form form={form} layout="vertical" initialValues={emptyProduct} onFinish={onSubmit}>
          <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
            <SectionCard title="顶部产品信息" description="产品图、产品名称、简短说明和咨询按钮。" status={product.isPublished ? 'active' : 'hidden'}>
              <Row gutter={16}>
                <Col xs={24} md={12}><Form.Item name="name" label="产品名称" rules={[{ required: true, message: '请填写产品名称' }]}><Input placeholder="例如：王储全合成汽油机油" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="categoryId" label="产品分类" rules={[{ required: true, message: '请选择产品分类' }]}><Select options={categories.map((category) => ({ label: category.name, value: category.id }))} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="sortOrder" label="显示顺序"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="topSubtitle" label="顶部简短说明"><Input /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="slug" label="网址标识"><Input placeholder="不填会根据产品名称生成" /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="isPublished" label="前台显示" valuePropName="checked"><Switch /></Form.Item></Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}><Form.Item name="listCoverImageUrl" label="产品列表封面图"><Dropzone value={product.listCoverImageUrl} cropPreset="productListCover" onChange={(url) => setField('listCoverImageUrl', url)} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item name="coverImageUrl" label="详情页顶部产品图"><Dropzone value={product.coverImageUrl} cropPreset="productDetailTop" onChange={(url) => setField('coverImageUrl', url)} /></Form.Item></Col>
              </Row>
            </SectionCard>
            <SectionCard title="产品详情介绍" description="详情标题、介绍文字和产品大图。">
              <Form.Item name="detailTitle" label="详情标题"><Input placeholder="例如：OMAJIC-UV2030" /></Form.Item>
              <Form.Item name="detailDescription" label="详情描述"><Input.TextArea rows={5} /></Form.Item>
              <Form.Item name="detailImageUrl" label="详情大图"><Dropzone value={product.detailImageUrl} cropPreset="productDetailMiddle" onChange={(url) => setField('detailImageUrl', url)} /></Form.Item>
            </SectionCard>
            <SectionCard title="产品参数与基本属性" description="上传完整参数与属性图。">
              <Form.Item name="productSpecsImageUrl" label="产品参数与基本属性图"><Dropzone value={product.productSpecsImageUrl} cropPreset="productSpecs" onChange={(url) => setField('productSpecsImageUrl', url)} /></Form.Item>
            </SectionCard>
            <SectionCard title="产品细节图库" description="维护产品细节图和说明。">
              <Space style={{ marginBottom: 12 }}><Button type="primary" disabled={detailGallery.length >= 6} onClick={() => setField('detailGallery', [...detailGallery, { imageUrl: '', caption: '细节' }])}>新增细节图</Button></Space>
              <Row gutter={[16, 16]}>
                {detailGallery.map((item, index) => <Col xs={24} md={12} xl={8} key={index}><Card title={`细节 ${index + 1}`} extra={<ConfirmButton danger size="small" title="确定删除这张细节图吗？" onConfirm={() => setField('detailGallery', detailGallery.filter((_, itemIndex) => itemIndex !== index))}>删除</ConfirmButton>}><Dropzone value={item.imageUrl} cropPreset="productDetailGallery" onChange={(imageUrl) => updateGallery(index, { imageUrl })} /><Input style={{ marginTop: 12 }} value={item.caption || ''} onChange={(e) => updateGallery(index, { caption: e.target.value })} placeholder="图片说明" /></Card></Col>)}
              </Row>
            </SectionCard>
            <SectionCard title="稳定生产表现" description="底部标题、说明文字和特点图标。">
              <Form.Item name="performanceTitle" label="模块标题"><Input placeholder={defaultPerformanceTitle} /></Form.Item>
              <Form.Item name="performanceText" label="模块说明"><Input.TextArea rows={4} placeholder={defaultPerformanceText} /></Form.Item>
              <Space style={{ marginBottom: 12 }}><Button type="primary" disabled={performanceItems.length >= 4} onClick={() => setField('performanceItems', [...performanceItems, { icon: '●', title: '', description: '' }])}>新增特点</Button></Space>
              <Row gutter={[16, 16]}>
                {performanceItems.map((item, index) => <Col xs={24} md={12} xl={6} key={index}><Card title={`特点 ${index + 1}`} extra={<ConfirmButton danger size="small" title="确定删除这个特点吗？" onConfirm={() => setField('performanceItems', performanceItems.filter((_, itemIndex) => itemIndex !== index))}>删除</ConfirmButton>}><Input value={item.icon || ''} onChange={(e) => updatePerformanceItem(index, { icon: e.target.value })} placeholder="图标" /><Input style={{ marginTop: 12 }} value={item.title || ''} onChange={(e) => updatePerformanceItem(index, { title: e.target.value })} placeholder="标题" /><Input style={{ marginTop: 12 }} value={item.description || ''} onChange={(e) => updatePerformanceItem(index, { description: e.target.value })} placeholder="说明" /></Card></Col>)}
              </Row>
            </SectionCard>
          </SectionCardGroup>
          <Card style={{ marginTop: 16 }}><Space><Button type="primary" htmlType="submit" loading={saving}>{saveText}</Button><Button onClick={() => navigate('/admin/products')}>返回产品列表</Button></Space></Card>
        </Form>
      )}
    </div>
  );
}
