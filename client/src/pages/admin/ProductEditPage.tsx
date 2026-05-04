import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminCategories, adminProduct, saveProduct } from '../../api/adminApi';
import type { Product, ProductCategory } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

type Spec = { name: string; value: string };
type Feature = { title: string; description: string; icon?: string };
type DetailBlock = { title?: string; body?: string; imageUrl?: string };

const emptyProduct: Partial<Product> = {
  name: '',
  slug: '',
  category: '工业油品',
  categoryId: '',
  subtitle: '',
  summary: '',
  description: '',
  coverImageUrl: '',
  galleryImageUrls: [],
  specifications: [],
  detailSections: [],
  featureCards: [],
  sortOrder: 0,
  isPublished: true,
  seoTitle: '',
  seoDescription: ''
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
  const [slugEdited, setSlugEdited] = useState(Boolean(id));
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const rows = await adminCategories();
        setCategories(rows);
        if (id) {
          setProduct(await adminProduct(id));
          setSlugEdited(true);
        } else {
          setProduct({ ...emptyProduct, categoryId: rows[0]?.id || '' });
          setSlugEdited(false);
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
    setProduct((prev) => ({ ...prev, name: value, ...(!isEditing && !slugEdited ? { slug: createSlug(value) } : {}) }));
    setMessage('');
  }

  function setSlug(value: string) {
    setSlugEdited(true);
    setField('slug', createSlug(value));
  }

  function updateSpec(index: number, patch: Partial<Spec>) {
    const nextSpecs = ([...(product.specifications || [])] as Spec[]);
    nextSpecs[index] = { ...nextSpecs[index], ...patch };
    setField('specifications', nextSpecs);
  }

  function updateDetailBlock(index: number, patch: Partial<DetailBlock>) {
    const nextBlocks = ([...(product.detailSections || [])] as DetailBlock[]);
    nextBlocks[index] = { ...nextBlocks[index], ...patch };
    setField('detailSections', nextBlocks);
  }

  function updateFeature(index: number, patch: Partial<Feature>) {
    const nextFeatures = ([...(product.featureCards || [])] as Feature[]);
    nextFeatures[index] = { ...nextFeatures[index], ...patch };
    setField('featureCards', nextFeatures);
  }

  function removeGalleryImage(index: number) {
    setField('galleryImageUrls', (product.galleryImageUrls || []).filter((_, imageIndex) => imageIndex !== index));
  }

  function validate() {
    if (!product.name?.trim()) return '请填写产品名称';
    if (!product.slug?.trim()) return '请填写页面网址后缀';
    if (!/^[a-z0-9-]+$/.test(product.slug.trim())) return '页面网址后缀只能填写小写英文、数字和短横线，例如 api-ci-4';
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
      await saveProduct({ ...product, slug: product.slug?.trim(), category: category?.name || product.category || '工业油品' });
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : '产品保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  const specs = (product.specifications || []) as Spec[];
  const detailBlocks = (product.detailSections || []) as DetailBlock[];
  const features = (product.featureCards || []) as Feature[];
  const selectedCategory = categories.find((category) => category.id === product.categoryId);
  const galleryImages = product.galleryImageUrls || [];
  const saveText = isEditing ? '保存修改' : '创建产品';
  const needsManualSlug = !isEditing && Boolean(product.name?.trim()) && !product.slug;

  return (
    <section className="admin-panel product-edit-page">
      <div className="product-edit-hero">
        <div className="admin-title-block">
          <span className="page-editor-label">{isEditing ? '产品编辑' : '新建产品'}</span>
          <h1>{isEditing ? '编辑产品' : '新建产品'}</h1>
          <p>按照前台产品详情页的展示顺序维护内容：顶部展示、详情正文、产品参数、细节图片和特点图标。</p>
        </div>
        <div className={product.isPublished ? 'product-publish-pill active' : 'product-publish-pill'}>{product.isPublished ? '前台显示' : '暂不显示'}</div>
      </div>

      {loading && <p className="page-loading">产品信息加载中...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && (
        <form className="product-edit-workspace" onSubmit={onSubmit}>
          <div className="product-edit-main">
            <section className="admin-subsection product-edit-card product-display-card">
              <div className="product-edit-section-title"><span>01</span><div><h2>顶部展示信息</h2><p>对应详情页顶部的产品图片、名称、分类、副标题和咨询入口。</p></div></div>
              <div className="product-basic-grid">
                <label>产品名称<input value={product.name || ''} onChange={(e) => setName(e.target.value)} placeholder="例如：王储全合成汽油机油" /></label>
                <label>产品分类<select value={product.categoryId || ''} onChange={(e) => setField('categoryId', e.target.value)}><option value="">请选择分类</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
              </div>
              <label>产品副标题<input value={product.subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)} placeholder="显示在产品名称下方，例如：强劲保护，稳定输出" /></label>
              <label>产品摘要<textarea value={product.summary || ''} onChange={(e) => setField('summary', e.target.value)} placeholder="用于产品列表、详情页兜底说明和搜索摘要。" /></label>
              <div className="product-basic-grid">
                <label>页面网址后缀<input value={product.slug || ''} onChange={(e) => setSlug(e.target.value)} placeholder="api-ci-4" /></label>
                <label>显示顺序<input type="number" value={product.sortOrder || 0} onChange={(e) => setField('sortOrder', Number(e.target.value))} /></label>
              </div>
              <p className="field-help">网址后缀只填写小写英文、数字和短横线。数字越小，产品在列表中越靠前。</p>
              {needsManualSlug && <p className="field-warning">当前产品名称没有生成英文网址后缀，请手动填写。</p>}
            </section>

            <section className="admin-subsection product-edit-card product-detail-editor-card">
              <div className="product-edit-section-title"><span>02</span><div><h2>产品详情正文</h2><p>对应详情页“产品详情”区域，可维护主介绍和多组图文补充内容。</p></div></div>
              <label>详情介绍<textarea value={product.description || ''} onChange={(e) => setField('description', e.target.value)} placeholder="说明产品定位、适用场景、核心卖点和服务支持。" /></label>
              <div className="product-editor-toolbar"><h3>补充图文区块</h3><button type="button" onClick={() => setField('detailSections', [...detailBlocks, { title: '', body: '', imageUrl: '' }])}>新增图文区块</button></div>
              {detailBlocks.map((block, index) => <article className="product-detail-block-editor" key={index}><div className="product-detail-block-head"><span>区块 {index + 1}</span><button type="button" onClick={() => setField('detailSections', detailBlocks.filter((_, blockIndex) => blockIndex !== index))}>删除区块</button></div><div className="product-detail-block-grid"><div className="section-fields-stack"><label>区块标题<input value={block.title || ''} onChange={(e) => updateDetailBlock(index, { title: e.target.value })} /></label><label>区块说明<textarea value={block.body || ''} onChange={(e) => updateDetailBlock(index, { body: e.target.value })} /></label></div><div className="section-media-block"><div className="section-block-title"><h4>区块图片</h4><p>显示在产品详情正文下方。</p></div><ImageUploader value={block.imageUrl} onChange={(imageUrl) => updateDetailBlock(index, { imageUrl })} /></div></div></article>)}
              {detailBlocks.length === 0 && <p className="empty-state">如需在详情介绍下方展示更多图文内容，可点击“新增图文区块”。</p>}
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>03</span><div><h2>产品参数</h2><p>对应详情页“产品参数”信息，例如粘度级别、适用类型和包装规格。</p></div></div>
              <div className="product-editor-toolbar"><h3>参数列表</h3><button type="button" onClick={() => setField('specifications', [...specs, { name: '', value: '' }])}>新增参数</button></div>
              <div className="product-spec-editor-list">
                {specs.map((spec, index) => <div className="product-spec-editor" key={index}><input placeholder="参数名，例如 粘度级别" value={spec.name || ''} onChange={(e) => updateSpec(index, { name: e.target.value })} /><input placeholder="参数值，例如 0W-40" value={spec.value || ''} onChange={(e) => updateSpec(index, { value: e.target.value })} /><button type="button" onClick={() => setField('specifications', specs.filter((_, specIndex) => specIndex !== index))}>删除</button></div>)}
              </div>
              {specs.length === 0 && <p className="empty-state">暂未添加产品参数。</p>}
            </section>

            <section className="admin-subsection product-edit-card">
              <div className="product-edit-section-title"><span>04</span><div><h2>稳定生产表现</h2><p>对应详情页底部的特点图标，可用于展示稳定润滑、品质检测、应用支持等卖点。</p></div></div>
              <div className="product-editor-toolbar"><h3>特点图标</h3><button type="button" onClick={() => setField('featureCards', [...features, { title: '', description: '', icon: '●' }])}>新增特点</button></div>
              <div className="product-feature-editor-grid">
                {features.map((feature, index) => <article className="product-feature-editor" key={index}><div><span>{feature.icon || '●'}</span><button type="button" onClick={() => setField('featureCards', features.filter((_, featureIndex) => featureIndex !== index))}>删除</button></div><label>图标符号<input placeholder="例如 ●、◆、✓" value={feature.icon || ''} onChange={(e) => updateFeature(index, { icon: e.target.value })} /></label><label>特点标题<input value={feature.title || ''} onChange={(e) => updateFeature(index, { title: e.target.value })} /></label><label>特点说明<input value={feature.description || ''} onChange={(e) => updateFeature(index, { description: e.target.value })} /></label></article>)}
              </div>
              {features.length === 0 && <p className="empty-state">不填写时，前台会显示默认特点图标。</p>}
            </section>

            <section className="admin-subsection product-edit-card product-seo-card">
              <div className="product-edit-section-title"><span>05</span><div><h2>搜索设置（可选）</h2><p>不填写时，网站会优先使用产品名称和摘要。</p></div></div>
              <label>搜索标题<input value={product.seoTitle || ''} onChange={(e) => setField('seoTitle', e.target.value)} /></label>
              <label>搜索简介<textarea value={product.seoDescription || ''} onChange={(e) => setField('seoDescription', e.target.value)} /></label>
            </section>
          </div>

          <aside className="product-edit-side">
            <section className="admin-subsection product-edit-card product-preview-card">
              <h2>前台效果预览</h2>
              <div className="product-preview-image">{product.coverImageUrl ? <img src={product.coverImageUrl} alt={product.name || '产品封面'} /> : <span>上传封面后显示预览</span>}</div>
              <div className="product-preview-copy"><small>{selectedCategory?.name || '请选择产品分类'}</small><h3>{product.name || '产品名称'}</h3><p>{product.subtitle || product.summary || '产品副标题和摘要会显示在详情页顶部。'}</p></div>
              <div className="product-preview-metrics"><span><b>{specs.length}</b>参数</span><span><b>{galleryImages.length}</b>细节图</span><span><b>{features.length}</b>特点</span></div>
            </section>

            <section className="admin-subsection product-edit-card">
              <h2>封面和发布</h2>
              <p className="field-help">封面图显示在产品列表和详情页顶部。</p>
              <ImageUploader value={product.coverImageUrl} onChange={(url) => setField('coverImageUrl', url)} />
              <label className="checkbox"><input type="checkbox" checked={Boolean(product.isPublished)} onChange={(e) => setField('isPublished', e.target.checked)} />前台显示这个产品</label>
            </section>

            <section className="admin-subsection product-edit-card">
              <h2>产品细节图片</h2>
              <p className="field-help">对应详情页“产品细节”图库，可一次上传多张。</p>
              <ImageUploader value="" multiple onChange={() => {}} onMultipleChange={(urls) => setField('galleryImageUrls', [...galleryImages, ...urls])} />
              {galleryImages.length > 0 && <div className="product-gallery-list">{galleryImages.map((url, index) => <figure key={`${url}-${index}`}><img src={url} alt={`产品轮播图 ${index + 1}`} /><button type="button" onClick={() => removeGalleryImage(index)}>移除</button></figure>)}</div>}
            </section>
          </aside>

          <div className="product-save-bar"><div><strong>{product.name || '未命名产品'}</strong><span>{product.isPublished ? '保存后将在前台显示' : '保存后暂不在前台显示'}</span></div><button disabled={saving}>{saving ? '保存中...' : saveText}</button><button type="button" onClick={() => navigate('/admin/products')}>返回产品列表</button></div>
        </form>
      )}
    </section>
  );
}
