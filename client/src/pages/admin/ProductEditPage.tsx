import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminCategories, adminProduct, saveProduct } from '../../api/adminApi';
import type { Product, ProductCategory, ProductGalleryItem, ProductPerformanceItem } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const defaultPerformanceTitle = '稳定的生产表现';
const defaultPerformanceText = '公司围绕润滑产品建立研发、生产和服务体系，为客户提供可靠产品和持续支持。';

const emptyProduct: Partial<Product> = {
  name: '',
  slug: '',
  categoryName: '工业油品',
  categoryId: '',
  coverImageUrl: '',
  topSubtitle: '',
  detailTitle: '',
  detailDescription: '',
  detailImageUrl: '',
  productSpecsImageUrl: '',
  detailGallery: [],
  performanceTitle: defaultPerformanceTitle,
  performanceText: defaultPerformanceText,
  performanceItems: [],
  sortOrder: 0,
  isPublished: true
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProductEditPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Partial<Product>>(emptyProduct);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const rows = await adminCategories();
        setCategories(rows);
        if (id) {
          setProduct(await adminProduct(id));
        } else {
          setProduct({ ...emptyProduct, categoryId: rows[0]?.id || '', categoryName: rows[0]?.name || '工业油品' });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '产品信息加载失败');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((prev) => ({ ...prev, [key]: value }));
    setMessage('');
  }

  function setName(value: string) {
    setProduct((prev) => ({ ...prev, name: value, slug: prev.slug || createSlug(value) }));
    setMessage('');
  }

  function setCategory(categoryId: string) {
    const category = categories.find((item) => item.id === categoryId);
    setProduct((prev) => ({ ...prev, categoryId, categoryName: category?.name || prev.categoryName || '工业油品' }));
    setMessage('');
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

  function validate() {
    if (!product.name?.trim()) return '请填写产品名称';
    if (!product.categoryId) return '请选择产品分类';
    return '';
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      const category = categories.find((item) => item.id === product.categoryId);
      const slug = product.slug?.trim() || createSlug(product.name || '') || `product-${Date.now()}`;
      await saveProduct({ ...product, slug, categoryName: category?.name || product.categoryName || '工业油品' });
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : '产品保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  const detailGallery = product.detailGallery || [];
  const performanceItems = product.performanceItems || [];
  const selectedCategory = categories.find((category) => category.id === product.categoryId);
  const saveText = id ? '保存修改' : '创建产品';

  return (
    <section className="admin-panel product-edit-page">
      <div className="product-edit-hero">
        <div className="admin-title-block">
          <span className="page-editor-label">{id ? '产品编辑' : '新建产品'}</span>
          <h1>{id ? '编辑产品' : '新建产品'}</h1>
          <p>按照前台详情页截图的区块顺序维护内容：顶部产品信息、产品详情介绍、参数与属性、细节图库、稳定生产表现。</p>
        </div>
        <div className={product.isPublished ? 'product-publish-pill active' : 'product-publish-pill'}>{product.isPublished ? '前台显示' : '暂不显示'}</div>
      </div>

      {loading && <p className="page-loading">产品信息加载中...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && (
        <form className="product-edit-workspace product-edit-linear" onSubmit={onSubmit}>
          <div className="product-edit-main">
            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>01</span><div><h2>顶部产品信息</h2><p>对应详情页最上方的产品图、产品名称、简短说明和咨询按钮。</p></div></div>
              <div className="product-top-fields-grid">
                <label>产品名称<input value={product.name || ''} onChange={(e) => setName(e.target.value)} placeholder="例如：王储全合成汽油机油" /></label>
                <label>产品分类<select value={product.categoryId || ''} onChange={(e) => setCategory(e.target.value)}><option value="">请选择分类</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
                <label>显示顺序<input type="number" value={product.sortOrder || 0} onChange={(e) => setField('sortOrder', Number(e.target.value))} /></label>
                <label>顶部简短说明<input value={product.topSubtitle || ''} onChange={(e) => setField('topSubtitle', e.target.value)} placeholder="显示在产品名称下方" /></label>
              </div>
              <div className="product-intro-editor-grid">
                <div className="section-media-block"><div className="section-block-title"><h4>顶部产品图</h4><p>显示在详情页顶部左侧，也是产品列表图。</p></div><ImageUploader value={product.coverImageUrl} onChange={(url) => setField('coverImageUrl', url)} /></div>
                <div className="product-preview-copy"><small>{selectedCategory?.name || '请选择产品分类'}</small><h3>{product.name || '产品名称'}</h3><p>{product.topSubtitle || '顶部简短说明会显示在产品名称下方。'}</p><label className="checkbox"><input type="checkbox" checked={Boolean(product.isPublished)} onChange={(e) => setField('isPublished', e.target.checked)} />前台显示这个产品</label></div>
              </div>
              <p className="field-help">数字越小，产品在列表中越靠前。详情页网址会根据产品名称自动生成。</p>
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>02</span><div><h2>产品详情介绍</h2><p>对应截图中的详情标题、介绍文字和产品大图。</p></div></div>
              <div className="product-intro-editor-grid">
                <div className="section-fields-stack"><label>详情标题<input value={product.detailTitle || ''} onChange={(e) => setField('detailTitle', e.target.value)} placeholder="例如：OMAJIC-UV2030" /></label><label>详情描述<textarea value={product.detailDescription || ''} onChange={(e) => setField('detailDescription', e.target.value)} placeholder="填写详情区域展示的产品介绍文字。" /></label></div>
                <div className="section-media-block"><div className="section-block-title"><h4>详情大图</h4><p>显示在产品详情介绍下方，可以和顶部产品图不同。</p></div><ImageUploader value={product.detailImageUrl} onChange={(url) => setField('detailImageUrl', url)} /></div>
              </div>
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>03</span><div><h2>产品参数与基本属性</h2><p>客户会上传一张完整设计图，前台按原图比例完整展示。</p></div></div>
              <div className="product-parameter-image-editor single">
                <div className="section-media-block parameter-image-card"><div className="section-block-title"><h4>产品参数与基本属性图</h4><p>对应参考图中的完整参数和属性区域，建议上传清晰的白底整图。</p></div><ImageUploader value={product.productSpecsImageUrl} onChange={(url) => setField('productSpecsImageUrl', url)} /></div>
              </div>
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>04</span><div><h2>产品细节图库</h2><p>对应截图中的 6 张产品细节图，每张图都可以填写说明文字。</p></div></div>
              <div className="product-editor-toolbar"><h3>细节图片</h3><button type="button" disabled={detailGallery.length >= 6} onClick={() => setField('detailGallery', [...detailGallery, { imageUrl: '', caption: '细节' }])}>新增细节图</button></div>
              <div className="product-gallery-editor-grid">
                {detailGallery.map((item, index) => <article className="product-gallery-editor-card" key={index}><div className="product-detail-block-head"><span>细节 {index + 1}</span><button type="button" onClick={() => setField('detailGallery', detailGallery.filter((_, itemIndex) => itemIndex !== index))}>删除</button></div><ImageUploader value={item.imageUrl} onChange={(imageUrl) => updateGallery(index, { imageUrl })} /><label>图片说明<input value={item.caption || ''} onChange={(e) => updateGallery(index, { caption: e.target.value })} placeholder="细节" /></label></article>)}
              </div>
              {detailGallery.length === 0 && <p className="empty-state">暂未添加产品细节图。截图建议维护 6 张。</p>}
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>05</span><div><h2>稳定生产表现</h2><p>对应详情页底部标题、说明文字和 4 个特点图标。</p></div></div>
              <div className="product-performance-intro-grid"><label>模块标题<input value={product.performanceTitle || ''} onChange={(e) => setField('performanceTitle', e.target.value)} placeholder={defaultPerformanceTitle} /></label><label>模块说明<textarea value={product.performanceText || ''} onChange={(e) => setField('performanceText', e.target.value)} placeholder={defaultPerformanceText} /></label></div>
              <div className="product-editor-toolbar"><h3>特点图标</h3><button type="button" disabled={performanceItems.length >= 4} onClick={() => setField('performanceItems', [...performanceItems, { icon: '●', title: '', description: '' }])}>新增特点</button></div>
              <div className="product-performance-editor-grid">
                {performanceItems.map((item, index) => <article className="product-performance-editor-card" key={index}><div><span>{item.icon || '●'}</span><button type="button" onClick={() => setField('performanceItems', performanceItems.filter((_, itemIndex) => itemIndex !== index))}>删除</button></div><label>图标<input value={item.icon || ''} onChange={(e) => updatePerformanceItem(index, { icon: e.target.value })} placeholder="例如 ●、⚙、▣" /></label><label>标题<input value={item.title || ''} onChange={(e) => updatePerformanceItem(index, { title: e.target.value })} /></label><label>说明<input value={item.description || ''} onChange={(e) => updatePerformanceItem(index, { description: e.target.value })} /></label></article>)}
              </div>
              {performanceItems.length === 0 && <p className="empty-state">不填写特点图标时，前台会显示默认特点。</p>}
            </section>
          </div>

          <div className="product-save-bar"><div><strong>{product.name || '未命名产品'}</strong><span>{product.isPublished ? '保存后将在前台显示' : '保存后暂不在前台显示'}</span></div><button disabled={saving}>{saving ? '保存中...' : saveText}</button><button type="button" onClick={() => navigate('/admin/products')}>返回产品列表</button></div>
        </form>
      )}
    </section>
  );
}
