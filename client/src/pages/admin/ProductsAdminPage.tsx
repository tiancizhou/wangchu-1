import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { App, Button, Card, Col, Row, Space, Statistic, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { adminProducts, deleteProduct } from '../../api/adminApi';
import type { Product } from '../../api/publicApi';
import { ConfirmButton, PageHeader, SearchableTable } from '../../admin/components';

type ProductsAdminPageProps = {
  embedded?: boolean;
};

export function ProductsAdminPage({ embedded = false }: ProductsAdminPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { message } = App.useApp();

  async function load() {
    setLoading(true);
    try {
      setProducts(await adminProducts());
    } catch (err) {
      message.error(err instanceof Error ? err.message : '商品加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onDelete(id: string) {
    try {
      await deleteProduct(id);
      message.success('商品已删除');
      await load();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '商品删除失败');
    }
  }

  const publishedCount = products.filter((product) => product.isPublished).length;
  const columns: ColumnsType<Product> = [
    { title: '商品', dataIndex: 'name', render: (_, product) => <Space><div style={{ width: 56, height: 56, borderRadius: 8, background: '#f8fafc', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Typography.Text type="secondary">无图</Typography.Text>}</div><div><Typography.Text strong>{product.name}</Typography.Text><br /><Typography.Text type="secondary" style={{ fontSize: 12 }}>{product.topSubtitle || product.detailDescription || '暂无简介'}</Typography.Text></div></Space> },
    { title: '分类', render: (_, product) => product.categoryRef?.name || product.categoryName || '未分类' },
    { title: '排序', dataIndex: 'sortOrder', sorter: (a, b) => a.sortOrder - b.sortOrder },
    { title: '状态', dataIndex: 'isPublished', render: (value: boolean) => value ? <Tag color="success">已发布</Tag> : <Tag>未发布</Tag> },
    { title: '操作', render: (_, product) => <Space><Link to={`/admin/products/${product.id}/edit`}>编辑</Link><ConfirmButton size="small" danger title="确定删除这个商品吗？" onConfirm={() => onDelete(product.id)}>删除</ConfirmButton></Space> }
  ];

  const createButton = <Link to="/admin/products/new"><Button type="primary">新增商品</Button></Link>;

  return (
    <div>
      {!embedded && <PageHeader title="产品管理" description="维护产品中心展示的商品信息、图片、分类和发布状态。" extra={createButton} />}
      {embedded && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>{createButton}</div>}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}><Card><Statistic title="全部商品" value={products.length} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="已发布" value={publishedCount} /></Card></Col>
        <Col xs={24} md={8}><Card><Statistic title="未发布" value={products.length - publishedCount} /></Card></Col>
      </Row>
      <Card title="商品列表" loading={loading}>
        <SearchableTable columns={columns} data={products} rowKey="id" searchableKeys={['name', 'categoryName', 'topSubtitle']} searchPlaceholder="搜索商品、分类或简介" />
      </Card>
    </div>
  );
}
