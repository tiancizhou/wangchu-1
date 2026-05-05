import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { adminContentSections, saveContentSection } from '../../api/adminApi';
import { AboutEditor, ContactPanelEditor, FeatureCardsEditor, GenericItemsEditor, ProcessModuleEditor, sectionNames, SupportModuleEditor, type AboutData, type ContactPanelData, type FeatureItem, type ProcessItem, type SectionData, type SupportTab } from '../../components/admin/ContentSectionEditors';
import type { ContentSection } from '../../api/publicApi';

export type ContentSectionEditorConfig = {
  pageKey: string;
  title: string;
  description: string;
  editableKeys: string[];
  moduleHelp: Record<string, string>;
  loadingText?: string;
  emptyText?: string;
  saveSuccessText?: string;
  saveButtonText?: string;
  hideModuleSelector?: boolean;
  hidePublishSwitch?: boolean;
  hideBaseSettings?: boolean;
  featureCardsEditorMode?: 'default' | 'simpleEnterprise';
};

export const homeContentConfig: ContentSectionEditorConfig = {
  pageKey: 'home',
  title: '首页内容管理',
  description: '在这里修改首页上的文字、图片和模块显示状态。选择一个模块后填写表单，保存后会同步到网站首页。',
  editableKeys: ['featureCards', 'supportModule', 'processModule', 'aboutPreview'],
  moduleHelp: {
    featureCards: '显示在首页顶部服务优势区域，建议保持 4 个卡片。',
    supportModule: '显示在“生产设计与制作”区域，用于介绍生产、检测、检验能力。',
    processModule: '显示在首页深色工艺区域，用于介绍制作工艺和设备能力。',
    aboutPreview: '显示在首页“关于我们”区域，用于展示公司简介和图片。'
  },
  loadingText: '首页内容加载中...',
  emptyText: '还没有可编辑的首页模块，请先运行初始化数据。',
  saveSuccessText: '首页内容已保存',
  saveButtonText: '保存首页内容'
};

export function ContentSectionsAdminPage({ config = homeContentConfig }: { config?: ContentSectionEditorConfig }) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [editing, setEditing] = useState<ContentSection<SectionData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setSections(await adminContentSections(config.pageKey));
    } catch (err) {
      setError(err instanceof Error ? err.message : '内容加载失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setEditing(null);
    setDirty(false);
    setMessage('');
    load();
  }, [config.pageKey]);

  const visibleSections = useMemo(() => config.editableKeys.map((key) => sections.find((section) => section.sectionKey === key)).filter(Boolean) as ContentSection[], [config.editableKeys, sections]);

  useEffect(() => {
    if (!editing && !loading && visibleSections.length > 0) {
      setEditing(structuredClone(visibleSections[0]) as ContentSection<SectionData>);
    }
  }, [editing, loading, visibleSections]);

  function edit(section: ContentSection) {
    if (dirty && !confirm('当前内容还没有保存，确定切换到其他模块吗？')) return;
    setEditing(structuredClone(section) as ContentSection<SectionData>);
    setDirty(false);
    setError('');
    setMessage('');
  }

  function updateEditing(section: ContentSection<SectionData>) {
    setEditing(section);
    setDirty(true);
  }

  function setData(patch: Partial<SectionData>) {
    if (!editing) return;
    updateEditing({ ...editing, data: { ...(editing.data || {}), ...patch } });
  }

  function updateFeature(index: number, patch: Partial<FeatureItem>) {
    const items = [...(((editing?.data.items || []) as FeatureItem[]))];
    items[index] = { ...items[index], ...patch };
    setData({ items });
  }

  function updateSupportTab(index: number, patch: Partial<SupportTab>) {
    const tabs = [...(editing?.data.tabs || [])];
    tabs[index] = { ...tabs[index], ...patch };
    setData({ tabs });
  }

  function updateProcessItem(index: number, patch: Partial<ProcessItem>) {
    const items = [...(((editing?.data.items || []) as ProcessItem[]))];
    items[index] = { ...items[index], ...patch };
    setData({ items });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      const saved = await saveContentSection(editing);
      setMessage(config.saveSuccessText || '内容已保存');
      setDirty(false);
      setSections((items) => items.map((item) => item.id === saved.id ? saved : item));
      setEditing(structuredClone(saved) as ContentSection<SectionData>);
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel content-sections-page">
      <div className="admin-title-block content-sections-title">
        <span className="page-editor-label">内容模块</span>
        <h1>{config.title}</h1>
        <p>{config.description}</p>
      </div>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {loading && <p className="page-loading">{config.loadingText || '内容加载中...'}</p>}

      {!loading && visibleSections.length === 0 && <p className="empty-state">{config.emptyText || '还没有可编辑的内容模块，请先运行初始化数据。'}</p>}

      {!loading && visibleSections.length > 0 && (
        <div className={config.hideModuleSelector ? 'content-editor-layout content-editor-layout-simple' : 'content-editor-layout'}>
          {!config.hideModuleSelector && (
            <aside className="content-editor-sidebar">
              <div className="content-editor-sidebar-title"><h2>选择模块</h2><p>点击左侧模块，右侧立即编辑。</p></div>
              {visibleSections.map((section, index) => (
                <button className={editing?.id === section.id ? 'content-editor-nav-item active' : 'content-editor-nav-item'} type="button" onClick={() => edit(section)} key={section.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><strong>{sectionNames[section.sectionKey] || section.title}</strong><small>{config.moduleHelp[section.sectionKey] || '用于维护网站页面上的一块内容。'}</small></div>
                  <em>{section.isPublished ? '显示中' : '已隐藏'}</em>
                </button>
              ))}
            </aside>
          )}

          <div className="content-editor-pane">
            {editing && (
              <form className="admin-form content-editor-form" onSubmit={save}>
                <div className="content-editor-pane-head">
                  <div><span className="page-editor-label">正在编辑</span><h2>{sectionNames[editing.sectionKey] || editing.sectionKey}</h2><p>{config.moduleHelp[editing.sectionKey] || '修改这个模块在网站上的展示内容。'}</p></div>
                  {(!config.hidePublishSwitch || !editing.isPublished) && <label className="content-publish-switch"><input type="checkbox" checked={editing.isPublished} onChange={(e) => updateEditing({ ...editing, isPublished: e.target.checked })} /><span />在网站显示</label>}
                </div>

                {!config.hideBaseSettings && (
                  <div className="admin-subsection content-base-settings">
                    <h2>模块基础设置</h2>
                    <div className="content-base-grid">
                      <label>模块标题<input value={editing.title || ''} onChange={(e) => updateEditing({ ...editing, title: e.target.value })} /></label>
                      <label>模块副标题<input value={editing.subtitle || ''} onChange={(e) => updateEditing({ ...editing, subtitle: e.target.value })} /></label>
                    </div>
                  </div>
                )}

                {editing.sectionKey === 'featureCards' && <FeatureCardsEditor items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} mode={config.featureCardsEditorMode} />}
                {editing.sectionKey === 'supportModule' && <SupportModuleEditor tabs={editing.data.tabs || []} onUpdate={updateSupportTab} onChange={(tabs) => setData({ tabs })} />}
                {editing.sectionKey === 'processModule' && <ProcessModuleEditor items={(editing.data.items || []) as ProcessItem[]} backgroundImageUrl={editing.data.backgroundImageUrl} onUpdate={updateProcessItem} onChange={(items) => setData({ items })} onBackgroundChange={(backgroundImageUrl) => setData({ backgroundImageUrl })} />}
                {editing.sectionKey === 'aboutPreview' && <AboutEditor data={editing.data as AboutData} onChange={setData} />}
                {editing.sectionKey === 'advantages' && <GenericItemsEditor title="加盟优势" help="这些内容显示在产品中心的合作优势区域。" items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} />}
                {editing.sectionKey === 'benefits' && <GenericItemsEditor title="加盟福利" help="这些内容显示在产品中心的合作支持区域。" items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} />}
                {editing.sectionKey === 'contactPanel' && <ContactPanelEditor data={editing.data as ContactPanelData} onChange={setData} />}

                <div className="content-editor-save-bar"><button disabled={saving}>{saving ? '保存中...' : (config.saveButtonText || '保存内容')}</button>{dirty ? <span>有未保存的修改</span> : <span>当前内容已保存</span>}</div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
