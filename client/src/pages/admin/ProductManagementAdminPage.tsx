import { Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../admin/components';
import { CategoriesAdminPage } from './CategoriesAdminPage';
import { ProductsAdminPage } from './ProductsAdminPage';

type TabKey = 'products' | 'categories';

function getActiveTab(value: string | null): TabKey {
  return value === 'categories' ? 'categories' : 'products';
}

export function ProductManagementAdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get('tab'));

  function onTabChange(key: string) {
    setSearchParams(key === 'categories' ? { tab: 'categories' } : {});
  }

  return (
    <div>
      <PageHeader title="产品管理" description="统一管理产品列表、产品详情编辑和产品细项分类。" />
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          { key: 'products', label: '产品列表', children: <ProductsAdminPage embedded /> },
          { key: 'categories', label: '产品分类', children: <CategoriesAdminPage embedded /> }
        ]}
      />
    </div>
  );
}
