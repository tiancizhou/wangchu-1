import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { adminBanners, adminContentSections, deleteBanner, saveBanner, saveContentSection } from '../../api/adminApi';
import type { Banner, ContentSection } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { AboutEditor, FeatureCardsEditor, ProcessModuleEditor, sectionNames, SupportModuleEditor, type AboutData, type FeatureItem, type ProcessItem, type SectionData, type SupportTab } from '../../components/admin/ContentSectionEditors';
import { AboutPreview, FeatureCards, HeroCarousel, ProcessModule, SupportModule } from '../HomePage';

type SectionMap = Record<string, ContentSection<SectionData>>;

const defaultSections: Record<string, ContentSection<SectionData>> = {
  featureCards: createSection('featureCards', '服务优势', '', { items: [] }, 1),
  supportModule: createSection('supportModule', '生产设计与制作', '稼尔润（北京）润滑油有限公司', { tabs: [] }, 2),
  processModule: createSection('processModule', '先进的制作工艺', '稼尔润（北京）润滑油有限公司', { items: [] }, 3),
  aboutPreview: createSection('aboutPreview', '关于我们', '稼尔润（北京）润滑油有限公司', { imageUrl: '', body: '', linkUrl: '/#about' }, 4)
};

export function HomeVisualEditorPage() {
  const [sections, setSections] = useState<SectionMap>({ ...defaultSections });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeSupportIndex, setActiveSupportIndex] = useState(0);
  const [draftSection, setDraftSection] = useState<ContentSection<SectionData> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const [contentRows, bannerRows] = await Promise.all([adminContentSections('home'), adminBanners()]);
    setSections({ ...defaultSections, ...Object.fromEntries(contentRows.map((section) => [section.sectionKey, section as ContentSection<SectionData>])) });
    setBanners(bannerRows);
  }

  useEffect(() => { load().catch((err) => setError(err instanceof Error ? err.message : '首页编辑数据加载失败')); }, []);

  const previewBanners = useMemo(() => banners.length ? banners : [{ id: 'placeholder', title: '轮播图', subtitle: '', imageUrl: '', linkUrl: '', sortOrder: 0, isActive: true }] as Banner[], [banners]);
  const activeBanner = previewBanners[activeBannerIndex % Math.max(previewBanners.length, 1)];

  function openSection(sectionKey: string) {
    setDraftSection(structuredClone(sections[sectionKey] || defaultSections[sectionKey]));
    setMessage('');
    setError('');
  }

  function setDraftData(patch: Partial<SectionData>) {
    setDraftSection((current) => current ? { ...current, data: { ...(current.data || {}), ...patch } } : current);
  }

  function updateFeature(index: number, patch: Partial<FeatureItem>) {
    if (!draftSection) return;
    const items = [...(((draftSection.data.items || []) as FeatureItem[]))];
    items[index] = { ...items[index], ...patch };
    setDraftData({ items });
  }

  function updateSupportTab(index: number, patch: Partial<SupportTab>) {
    if (!draftSection) return;
    const tabs = [...(draftSection.data.tabs || [])];
    tabs[index] = { ...tabs[index], ...patch };
    setDraftData({ tabs });
  }

  function updateProcessItem(index: number, patch: Partial<ProcessItem>) {
    if (!draftSection) return;
    const items = [...(((draftSection.data.items || []) as ProcessItem[]))];
    items[index] = { ...items[index], ...patch };
    setDraftData({ items });
  }

  async function saveSection() {
    if (!draftSection) return;
    setSaving(true);
    setError('');
    try {
      await saveContentSection(draftSection);
      await load();
      setMessage(`${sectionNames[draftSection.sectionKey] || draftSection.sectionKey} 已保存`);
      setDraftSection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function onImagesUploaded(urls: string[]) {
    if (urls.length === 0) return;
    setSaving(true);
    setError('');
    try {
      await Promise.all(urls.map((url, index) => saveBanner({ title: '轮播图', subtitle: '', imageUrl: url, linkUrl: '', sortOrder: banners.length + index + 1, isActive: true })));
      await load();
      setMessage('轮播图已添加');
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function updateBanner(banner: Banner) {
    setSaving(true);
    setError('');
    try {
      await saveBanner({ ...banner, title: banner.title || '轮播图', subtitle: '', linkUrl: '' });
      await load();
      setMessage('轮播图已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图保存失败');
    } finally {
      setSaving(false);
    }
  }

  async function removeBanner(id: string) {
    if (!confirm('确定删除这张轮播图吗？')) return;
    setSaving(true);
    setError('');
    try {
      await deleteBanner(id);
      setActiveBannerIndex(0);
      await load();
      setMessage('轮播图已删除');
    } catch (err) {
      setError(err instanceof Error ? err.message : '轮播图删除失败');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="visual-editor-page">
      <div className="visual-editor-toolbar">
        <div><h1>首页可视化编辑</h1><p>这里展示的是首页真实布局，点击模块右上角按钮编辑对应文字和图片。</p></div>
        <Link to="/admin/content">高级内容编辑</Link>
      </div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {saving && <p>保存中...</p>}

      <div className="visual-preview">
        <div className="visual-hero-wrap">
          <HeroCarousel banners={previewBanners} banner={activeBanner} activeBannerIndex={activeBannerIndex} onSelect={setActiveBannerIndex} />
          <HeroControls banners={banners} activeBanner={activeBanner} activeBannerIndex={activeBannerIndex} saving={saving} onSelect={setActiveBannerIndex} onUpload={onImagesUploaded} onChange={(banner) => setBanners((items) => items.map((item) => item.id === banner.id ? banner : item))} onSave={updateBanner} onDelete={removeBanner} />
        </div>
        <VisualEditableSection label="首页服务卡片" section={sections.featureCards} onEdit={() => openSection('featureCards')}><FeatureCards section={sections.featureCards} /></VisualEditableSection>
        <VisualEditableSection label="生产设计与制作" section={sections.supportModule} onEdit={() => openSection('supportModule')}><SupportModule section={sections.supportModule} activeIndex={activeSupportIndex} onSelect={setActiveSupportIndex} /></VisualEditableSection>
        <VisualEditableSection label="先进的制作工艺" section={sections.processModule} onEdit={() => openSection('processModule')}><ProcessModule section={sections.processModule} /></VisualEditableSection>
        <VisualEditableSection label="关于我们预览" section={sections.aboutPreview} onEdit={() => openSection('aboutPreview')}><AboutPreview section={sections.aboutPreview} /></VisualEditableSection>
      </div>

      {draftSection && <SectionEditorDrawer section={draftSection} saving={saving} onClose={() => setDraftSection(null)} onSave={saveSection} onChange={setDraftSection} onDataChange={setDraftData} onFeatureUpdate={updateFeature} onSupportUpdate={updateSupportTab} onProcessUpdate={updateProcessItem} />}
    </section>
  );
}

function VisualEditableSection({ label, section, onEdit, children }: { label: string; section?: ContentSection<SectionData>; onEdit: () => void; children: ReactNode }) {
  return <div className="visual-editable-section"><div className="visual-section-controls"><span>{label}</span><span className="visual-section-badge">{section?.isPublished ? '已发布' : '未发布'}</span><button type="button" onClick={onEdit}>编辑</button></div>{children}</div>;
}

function HeroControls({ banners, activeBanner, activeBannerIndex, saving, onSelect, onUpload, onChange, onSave, onDelete }: { banners: Banner[]; activeBanner?: Banner; activeBannerIndex: number; saving: boolean; onSelect: (index: number) => void; onUpload: (urls: string[]) => void; onChange: (banner: Banner) => void; onSave: (banner: Banner) => void; onDelete: (id: string) => void }) {
  const editable = activeBanner && activeBanner.id !== 'placeholder' ? activeBanner : null;
  return <div className="visual-hero-controls"><strong>首页轮播图</strong><ImageUploader value="" multiple onChange={() => {}} onMultipleChange={onUpload} />{banners.length > 0 && <div className="visual-banner-switcher">{banners.map((banner, index) => <button type="button" className={index === activeBannerIndex ? 'active' : ''} onClick={() => onSelect(index)} key={banner.id}>第 {index + 1} 张{banner.isActive ? '' : '（未启用）'}</button>)}</div>}{editable && <div className="visual-banner-form"><label>排序<input type="number" value={editable.sortOrder} onChange={(e) => onChange({ ...editable, sortOrder: Number(e.target.value) })} /></label><label className="checkbox"><input type="checkbox" checked={editable.isActive} onChange={(e) => onChange({ ...editable, isActive: e.target.checked })} />启用</label><button type="button" disabled={saving} onClick={() => onSave(editable)}>保存轮播图</button><button type="button" onClick={() => onDelete(editable.id)}>删除轮播图</button></div>}</div>;
}

function SectionEditorDrawer({ section, saving, onClose, onSave, onChange, onDataChange, onFeatureUpdate, onSupportUpdate, onProcessUpdate }: { section: ContentSection<SectionData>; saving: boolean; onClose: () => void; onSave: () => void; onChange: (section: ContentSection<SectionData>) => void; onDataChange: (patch: Partial<SectionData>) => void; onFeatureUpdate: (index: number, patch: Partial<FeatureItem>) => void; onSupportUpdate: (index: number, patch: Partial<SupportTab>) => void; onProcessUpdate: (index: number, patch: Partial<ProcessItem>) => void }) {
  return <aside className="visual-editor-drawer"><div className="visual-drawer-title"><h2>{sectionNames[section.sectionKey] || section.sectionKey}</h2><button type="button" onClick={onClose}>关闭</button></div><label>模块标题<input value={section.title || ''} onChange={(e) => onChange({ ...section, title: e.target.value })} /></label><label>模块副标题<input value={section.subtitle || ''} onChange={(e) => onChange({ ...section, subtitle: e.target.value })} /></label><label className="checkbox"><input type="checkbox" checked={section.isPublished} onChange={(e) => onChange({ ...section, isPublished: e.target.checked })} />发布模块</label>{section.sectionKey === 'featureCards' && <FeatureCardsEditor items={(section.data.items || []) as FeatureItem[]} onUpdate={onFeatureUpdate} onChange={(items) => onDataChange({ items })} />}{section.sectionKey === 'supportModule' && <SupportModuleEditor tabs={section.data.tabs || []} onUpdate={onSupportUpdate} onChange={(tabs) => onDataChange({ tabs })} />}{section.sectionKey === 'processModule' && <ProcessModuleEditor items={(section.data.items || []) as ProcessItem[]} backgroundImageUrl={section.data.backgroundImageUrl} onUpdate={onProcessUpdate} onChange={(items) => onDataChange({ items })} onBackgroundChange={(backgroundImageUrl) => onDataChange({ backgroundImageUrl })} />}{section.sectionKey === 'aboutPreview' && <AboutEditor data={section.data as AboutData} onChange={onDataChange} />}<div className="visual-save-bar"><button type="button" disabled={saving} onClick={onSave}>保存并更新预览</button><button type="button" onClick={onClose}>取消</button></div></aside>;
}

function createSection(sectionKey: string, title: string, subtitle: string, data: SectionData, sortOrder: number): ContentSection<SectionData> {
  return { id: sectionKey, pageKey: 'home', sectionKey, title, subtitle, data, sortOrder, isPublished: true };
}
