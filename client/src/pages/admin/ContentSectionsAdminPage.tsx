import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { App, Alert, Button, Card, Col, Form, Input, List, Row, Space, Switch, Tag, Typography } from 'antd';
import { adminContentSections, saveContentSection } from '../../api/adminApi';
import { AboutEditor, ContactInfoEditor, ContactPanelEditor, FeatureCardsEditor, GenericItemsEditor, LegalStatementEditor, ProcessModuleEditor, sectionNames, SupportModuleEditor, SupportPageEditor, type AboutData, type ContactInfoData, type ContactPanelData, type FeatureItem, type LegalStatementData, type ProcessItem, type SectionData, type SupportPageData, type SupportTab } from '../../components/admin/ContentSectionEditors';
import type { ContentSection } from '../../api/publicApi';
import { PageHeader } from '../../admin/components';

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
  hidePageChrome?: boolean;
  hideEditorHeader?: boolean;
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
  const { modal, message } = App.useApp();

  const configSignature = `${config.pageKey}:${config.editableKeys.join('|')}`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const nextSections = await adminContentSections(config.pageKey);
        if (!cancelled) setSections(nextSections);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : '内容加载失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [config.pageKey]);

  useEffect(() => {
    setEditing(null);
    setDirty(false);
    setError('');
  }, [configSignature]);

  const visibleSections = useMemo(() => config.editableKeys.map((key) => sections.find((section) => section.sectionKey === key)).filter(Boolean) as ContentSection[], [config.editableKeys, sections]);

  useEffect(() => {
    if (!editing && !loading && visibleSections.length > 0) {
      setEditing(structuredClone(visibleSections[0]) as ContentSection<SectionData>);
    }
  }, [editing, loading, visibleSections]);

  function edit(section: ContentSection) {
    setEditing(structuredClone(section) as ContentSection<SectionData>);
    setDirty(false);
    setError('');
  }

  function requestEdit(section: ContentSection) {
    if (!dirty) {
      edit(section);
      return;
    }
    modal.confirm({ title: '当前内容还没有保存，确定切换到其他模块吗？', okText: '切换', cancelText: '继续编辑', onOk: () => edit(section) });
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
      message.success(config.saveSuccessText || '内容已保存');
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
    <div>
      {!config.hidePageChrome && <PageHeader title={config.title} description={config.description} />}
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      {loading && <Card><Typography.Text type="secondary">{config.loadingText || '内容加载中...'}</Typography.Text></Card>}
      {!loading && visibleSections.length === 0 && <Card><Typography.Text type="secondary">{config.emptyText || '还没有可编辑的内容模块，请先运行初始化数据。'}</Typography.Text></Card>}
      {!loading && visibleSections.length > 0 && (
        <Row gutter={[16, 16]}>
          {!config.hideModuleSelector && (
            <Col xs={24} lg={7}>
              <Card title="选择模块">
                <List
                  dataSource={visibleSections}
                  renderItem={(section, index) => (
                    <List.Item onClick={() => requestEdit(section)} style={{ cursor: 'pointer', padding: 12, borderRadius: 10, background: editing?.id === section.id ? 'rgba(22,119,255,0.08)' : undefined }}>
                      <List.Item.Meta title={<Space><Typography.Text>{String(index + 1).padStart(2, '0')}</Typography.Text><Typography.Text strong>{sectionNames[section.sectionKey] || section.title}</Typography.Text></Space>} description={config.moduleHelp[section.sectionKey] || '用于维护网站页面上的一块内容。'} />
                      <Tag color={section.isPublished ? 'success' : 'default'}>{section.isPublished ? '显示中' : '已隐藏'}</Tag>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          )}
          <Col xs={24} lg={config.hideModuleSelector ? 24 : 17}>
            {editing && (
              <form onSubmit={save}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {(!config.hideEditorHeader || !config.hidePublishSwitch || !editing.isPublished) && (
                    <Card>
                      <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
                        {!config.hideEditorHeader && <div><Typography.Text type="secondary">正在编辑</Typography.Text><Typography.Title level={4} style={{ margin: 0 }}>{sectionNames[editing.sectionKey] || editing.sectionKey}</Typography.Title><Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>{config.moduleHelp[editing.sectionKey] || '修改这个模块在网站上的展示内容。'}</Typography.Paragraph></div>}
                        {(!config.hidePublishSwitch || !editing.isPublished) && <Space><Switch checked={editing.isPublished} onChange={(checked) => updateEditing({ ...editing, isPublished: checked })} />在网站显示</Space>}
                      </Space>
                    </Card>
                  )}
                  {!config.hideBaseSettings && <Card title="模块基础设置"><Row gutter={16}><Col xs={24} md={12}><Form.Item label="模块标题"><Input value={editing.title || ''} onChange={(e) => updateEditing({ ...editing, title: e.target.value })} /></Form.Item></Col><Col xs={24} md={12}><Form.Item label="模块副标题"><Input value={editing.subtitle || ''} onChange={(e) => updateEditing({ ...editing, subtitle: e.target.value })} /></Form.Item></Col></Row></Card>}
                  {editing.sectionKey === 'featureCards' && <FeatureCardsEditor items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} mode={config.featureCardsEditorMode} />}
                  {editing.sectionKey === 'supportModule' && <SupportModuleEditor tabs={editing.data.tabs || []} onUpdate={updateSupportTab} onChange={(tabs) => setData({ tabs })} />}
                  {editing.sectionKey === 'supportPage' && <SupportPageEditor data={editing.data as SupportPageData} onChange={setData} />}
                  {editing.sectionKey === 'processModule' && <ProcessModuleEditor items={(editing.data.items || []) as ProcessItem[]} backgroundImageUrl={editing.data.backgroundImageUrl} onUpdate={updateProcessItem} onChange={(items) => setData({ items })} onBackgroundChange={(backgroundImageUrl) => setData({ backgroundImageUrl })} />}
                  {editing.sectionKey === 'aboutPreview' && <AboutEditor data={editing.data as AboutData} onChange={setData} />}
                  {editing.sectionKey === 'advantages' && <GenericItemsEditor title="加盟优势" help="这些内容显示在产品中心的合作优势区域。" items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} />}
                  {editing.sectionKey === 'benefits' && <GenericItemsEditor title="加盟福利" help="这些内容显示在产品中心的合作支持区域。" items={(editing.data.items || []) as FeatureItem[]} onUpdate={updateFeature} onChange={(items) => setData({ items })} />}
                  {editing.sectionKey === 'contactPanel' && <ContactPanelEditor data={editing.data as ContactPanelData} onChange={setData} />}
                  {editing.sectionKey === 'contactInfo' && <ContactInfoEditor data={editing.data as ContactInfoData} onChange={setData} />}
                  {editing.sectionKey === 'legalStatement' && <LegalStatementEditor data={editing.data as LegalStatementData} onChange={setData} />}
                  {editing.sectionKey === 'certificatePreview' && <Card><Typography.Paragraph type="secondary">荣誉资质图片请在"荣誉资质"管理中上传和排序。此处仅编辑模块标题和显示状态。</Typography.Paragraph></Card>}
                  <Card><Space><Button type="primary" htmlType="submit" loading={saving}>{saving ? '保存中...' : (config.saveButtonText || '保存内容')}</Button><Typography.Text type={dirty ? 'warning' : 'success'}>{dirty ? '有未保存的修改' : '当前内容已保存'}</Typography.Text></Space></Card>
                </Space>
              </form>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}
