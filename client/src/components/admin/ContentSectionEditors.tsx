import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Space, Tooltip, Typography } from 'antd';
import { BoldOutlined } from '@ant-design/icons';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { ConfirmButton, Dropzone, DragHandle, DraggableList, SectionCard, SectionCardGroup } from '../../admin/components';
import { getSupportPageContent } from '../../pages/supportPageContent';
import { getNativeTextArea, getRichTextDraftValue, wrapTextSelection } from './richTextEditing';

export type FeatureItem = { title?: string; description?: string; icon?: string; linkUrl?: string; sections?: LegalStatementSection[] };
export type SupportTab = { title?: string; heading?: string; description?: string; imageUrl?: string; thumbnails?: string[]; linkUrl?: string; sections?: LegalStatementSection[] };
export type ProcessGalleryImage = string | { imageUrl?: string; title?: string };
export type ProcessItem = { title?: string; description?: string; imageUrl?: string; galleryImages?: ProcessGalleryImage[]; linkUrl?: string; sections?: LegalStatementSection[] };
export type AboutData = { imageUrl?: string; body?: string; linkUrl?: string };
export type ContactPanelData = { consultantName?: string; consultantTitle?: string; consultantAvatarUrl?: string; description?: string; buttonText?: string; industryOptions?: string[] };
export type ContactInfoItem = { label?: string; value?: string };
export type ContactInfoData = { body?: string; mapImageUrl?: string; items?: ContactInfoItem[] };
export type LegalStatementSection = { heading?: string; paragraphs?: string[] };
export type LegalStatementData = { sections?: LegalStatementSection[] };
export type SupportPageCenter = { title?: string; description?: string };
export type SupportPageTechnicalColumn = { title?: string; description?: string };
export type SupportPageServiceStation = { station?: string; contact?: string; phone?: string; address?: string; areas?: string };
export type SupportPageData = {
  heroImageUrl?: string;
  centers?: SupportPageCenter[];
  technicalColumns?: SupportPageTechnicalColumn[];
  serviceStations?: SupportPageServiceStation[];
};
export type SectionData = {
  items?: FeatureItem[] | ProcessItem[] | ContactInfoItem[];
  tabs?: SupportTab[];
  sections?: LegalStatementSection[];
  imageUrl?: string;
  backgroundImageUrl?: string;
  mapImageUrl?: string;
  body?: string;
  linkUrl?: string;
  consultantName?: string;
  consultantTitle?: string;
  consultantAvatarUrl?: string;
  description?: string;
  buttonText?: string;
  industryOptions?: string[];
  heroImageUrl?: string;
  centers?: SupportPageCenter[];
  technicalColumns?: SupportPageTechnicalColumn[];
  serviceStations?: SupportPageServiceStation[];
};

export const sectionNames: Record<string, string> = {
  featureCards: '企业管理模块',
  supportModule: '生产设计与制作',
  processModule: '先进的制作工艺',
  aboutPreview: '关于我们',
  advantages: '加盟优势',
  benefits: '加盟福利',
  contactPanel: '咨询页顾问信息',
  contactInfo: '联系我们',
  legalStatement: '法律声明',
  brandCustomization: '品牌定制',
  additionalServices: '附加服务',
  naturalAssurance: '天然保障',
  factoryDirect: '工厂直供',
  productionBlending: '生产调和详情',
  labTesting: '检测详情',
  qualityInspection: '品质检验详情',
  certificatePreview: '荣誉资质',
  supportPage: '技术支持二级页面'
};

const paragraphsToText = (paragraphs?: string[]) => (paragraphs || []).join('\n\n');
const textToParagraphs = (value: string) => value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

function RichTextArea({ value, onChange, rows = 10, placeholder }: { value: string; onChange: (value: string) => void; rows?: number; placeholder?: string }) {
  const textareaRef = useRef<TextAreaRef | null>(null);
  const [focused, setFocused] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const displayValue = getRichTextDraftValue(value, draftValue, focused);

  useEffect(() => {
    if (!focused) setDraftValue(value);
  }, [focused, value]);

  function updateValue(nextValue: string) {
    setDraftValue(nextValue);
    onChange(nextValue);
  }

  function wrapSelection(wrapper: string) {
    const textarea = getNativeTextArea(textareaRef.current);
    if (!textarea) return;
    const wrapped = wrapTextSelection(displayValue, textarea.selectionStart, textarea.selectionEnd, wrapper);
    if (!wrapped) return;
    updateValue(wrapped.value);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(wrapped.selectionStart, wrapped.selectionEnd);
    });
  }

  return (
    <div>
      <Space style={{ marginBottom: 4 }}>
        <Tooltip title="加粗选中文字"><Button size="small" icon={<BoldOutlined />} onMouseDown={(event) => event.preventDefault()} onClick={() => wrapSelection('**')} /></Tooltip>
      </Space>
      <Input.TextArea ref={textareaRef} rows={rows} value={displayValue} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={(event) => updateValue(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FeatureDetailArticleEditor({ item, onUpdate }: { item: FeatureItem; onUpdate: (patch: Partial<FeatureItem>) => void }) {
  const paragraphs = item.sections?.flatMap((section) => section.paragraphs || []) || [];

  return (
    <Card title="了解更多正文" style={{ marginTop: 16 }}>
      <Typography.Paragraph type="secondary">详情页标题会显示在 A4 纸内部，正文按关于我们页面的富文本格式展示。每段正文之间请空一行。</Typography.Paragraph>
      <Form.Item label="正文内容"><RichTextArea rows={10} value={paragraphsToText(paragraphs)} onChange={(value) => onUpdate({ sections: [{ paragraphs: textToParagraphs(value) }] })} placeholder="每段之间请空一行，选中文字后可点击 B 加粗" /></Form.Item>
    </Card>
  );
}

function SingleDetailArticleEditor<T extends { sections?: LegalStatementSection[] }>({ item, onUpdate, title = '详情页正文' }: { item: T; onUpdate: (patch: Partial<T>) => void; title?: string }) {
  const paragraphs = item.sections?.flatMap((section) => section.paragraphs || []) || [];

  return (
    <Card title={title} style={{ marginTop: 16 }}>
      <Typography.Paragraph type="secondary">正文按关于我们页面的富文本格式展示。每段正文之间请空一行。</Typography.Paragraph>
      <Form.Item label="正文内容"><RichTextArea rows={10} value={paragraphsToText(paragraphs)} onChange={(value) => onUpdate({ sections: [{ paragraphs: textToParagraphs(value) }] } as Partial<T>)} placeholder="每段之间请空一行，选中文字后可点击 B 加粗" /></Form.Item>
    </Card>
  );
}

export function FeatureCardsEditor({ items, onUpdate, onChange }: { items: FeatureItem[]; onUpdate: (index: number, patch: Partial<FeatureItem>) => void; onChange: (items: FeatureItem[]) => void; mode?: 'default' | 'simpleEnterprise' }) {
  const rows = items.map((item, index) => ({ ...item, __id: `${index}-${item.title || 'card'}` }));
  return (
    <div>
      <Space style={{ marginBottom: 12 }}><Button type="primary" onClick={() => onChange([...items, { title: '', description: '', icon: '✥', linkUrl: '/consult' }])}>新增模块卡片</Button></Space>
      <DraggableList
        items={rows}
        getItemId={(item) => item.__id}
        onReorder={(next) => onChange(next.map(({ __id, ...item }) => item))}
        renderItem={(item, index, dragHandle) => (
          <SectionCard title={item.title || `第 ${index + 1} 张卡片`} description={item.description || '展开后编辑卡片内容'} extra={<><DragHandle dragHandle={dragHandle} /><ConfirmButton danger size="small" title="确定删除这张卡片吗？" onConfirm={() => onChange(items.filter((_, i) => i !== index))}>删除</ConfirmButton></>}>
            <Form layout="vertical">
              <Form.Item label="图标符号"><Input value={item.icon || ''} onChange={(e) => onUpdate(index, { icon: e.target.value })} placeholder="例如 ✥、●" /></Form.Item>
              <Form.Item label="首页显示标题"><Input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></Form.Item>
              <Form.Item label="点击后打开的页面"><Input value={item.linkUrl || ''} onChange={(e) => onUpdate(index, { linkUrl: e.target.value })} placeholder="例如 /features/brand-customization" /></Form.Item>
              <Form.Item label="首页显示说明"><Input.TextArea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} rows={4} /></Form.Item>
              <FeatureDetailArticleEditor item={item} onUpdate={(patch) => onUpdate(index, patch)} />
            </Form>
          </SectionCard>
        )}
      />
    </div>
  );
}

export function SupportModuleEditor({ tabs, onUpdate, onChange }: { tabs: SupportTab[]; onUpdate: (index: number, patch: Partial<SupportTab>) => void; onChange: (tabs: SupportTab[]) => void }) {
  const canAddTab = tabs.length < 3;

  function addTab() {
    if (!canAddTab) return;
    const defaultLinks = ['/support/production-blending', '/support/lab-testing', '/support/quality-inspection'];
    onChange([...tabs, { title: '', heading: '', description: '', imageUrl: '', thumbnails: [], linkUrl: defaultLinks[tabs.length] || defaultLinks[0], sections: [] }]);
  }

  return (
    <div>
      <Space style={{ marginBottom: 12 }}><Button type="primary" disabled={!canAddTab} onClick={addTab}>新增栏目</Button><Typography.Text type="secondary">最多设置 3 个栏目</Typography.Text></Space>
      <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
        {tabs.map((tab, index) => (
          <SectionCard key={index} title={tab.title || `栏目 ${index + 1}`} description={tab.heading || tab.description?.slice(0, 40) || '展开后编辑栏目内容'} extra={<ConfirmButton danger size="small" title="确定删除这个栏目吗？" onConfirm={() => onChange(tabs.filter((_, tabIndex) => tabIndex !== index))}>删除</ConfirmButton>}>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}><Form.Item label="栏目名称"><Input value={tab.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></Form.Item></Col>
                <Col xs={24} md={12}><Form.Item label="标题"><Input value={tab.heading || ''} onChange={(e) => onUpdate(index, { heading: e.target.value })} /></Form.Item></Col>
              </Row>
              <Form.Item label="说明文字"><Input.TextArea value={tab.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} rows={4} /></Form.Item>
              <Form.Item label="立即查看跳转页面"><Input value={tab.linkUrl || ''} onChange={(e) => onUpdate(index, { linkUrl: e.target.value })} placeholder="例如 /support/production-blending" /></Form.Item>
              <SingleDetailArticleEditor item={tab} onUpdate={(patch) => onUpdate(index, patch)} />
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card title="主图"><Dropzone value={tab.imageUrl} cropPreset="supportMiddle" onChange={(url) => onUpdate(index, { imageUrl: url })} /></Card></Col>
                <Col xs={24} lg={12}><Card title="轮播图片"><Dropzone value="" multiple cropPreset="supportThumbnail" onChange={() => {}} onMultipleChange={(urls) => onUpdate(index, { thumbnails: [...(tab.thumbnails || []), ...urls] })} /><Row gutter={[8, 8]} style={{ marginTop: 12 }}>{(tab.thumbnails || []).map((url) => <Col span={12} key={url}><Card size="small" cover={<img src={url} alt="底部轮播图" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }} />} actions={[<Button type="link" danger onClick={() => onUpdate(index, { thumbnails: (tab.thumbnails || []).filter((item) => item !== url) })}>移除图片</Button>]} /></Col>)}</Row></Card></Col>
              </Row>
            </Form>
          </SectionCard>
        ))}
      </SectionCardGroup>
      {tabs.length === 0 && <Card><Typography.Text type="secondary">还没有生产设计栏目，请点击“新增栏目”。</Typography.Text></Card>}
    </div>
  );
}

export function SupportPageEditor({ data, onChange }: { data: SupportPageData; onChange: (patch: Partial<SectionData>) => void }) {
  const mergedData = getSupportPageContent(data);
  const centers = mergedData.centers;
  const technicalColumns = mergedData.technicalColumns;
  const serviceStations = mergedData.serviceStations;

  function updateCenter(index: number, patch: Partial<SupportPageCenter>) {
    const next = [...centers];
    next[index] = { ...next[index], ...patch };
    onChange({ centers: next });
  }

  function updateTechnicalColumn(index: number, patch: Partial<SupportPageTechnicalColumn>) {
    const next = [...technicalColumns];
    next[index] = { ...next[index], ...patch };
    onChange({ technicalColumns: next });
  }

  function updateServiceStation(index: number, patch: Partial<SupportPageServiceStation>) {
    const next = [...serviceStations];
    next[index] = { ...next[index], ...patch };
    onChange({ serviceStations: next });
  }

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card title="顶部科技感图片"><Dropzone value={mergedData.heroImageUrl} onChange={(heroImageUrl) => onChange({ heroImageUrl })} /></Card>
      <Card title="技术支持：研发中心与质量中心">
        <Row gutter={[16, 16]}>
          {centers.map((center, index) => (
            <Col xs={24} lg={12} key={index}>
              <Card size="small" title={center.title || `中心 ${index + 1}`}>
                <Form layout="vertical">
                  <Form.Item label="标题"><Input value={center.title || ''} onChange={(event) => updateCenter(index, { title: event.target.value })} /></Form.Item>
                  <Form.Item label="说明文字"><Input.TextArea rows={5} value={center.description || ''} onChange={(event) => updateCenter(index, { description: event.target.value })} /></Form.Item>
                </Form>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <Card title="技术支持：六个栏目">
        <Row gutter={[16, 16]}>
          {technicalColumns.map((column, index) => (
            <Col xs={24} md={12} xl={8} key={index}>
              <Card size="small" title={column.title || `栏目 ${index + 1}`}>
                <Form layout="vertical">
                  <Form.Item label="标题"><Input value={column.title || ''} onChange={(event) => updateTechnicalColumn(index, { title: event.target.value })} /></Form.Item>
                  <Form.Item label="说明文字"><Input.TextArea rows={4} value={column.description || ''} onChange={(event) => updateTechnicalColumn(index, { description: event.target.value })} /></Form.Item>
                </Form>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
      <Card title="售后支持：七个服务站">
        <Row gutter={[16, 16]}>
          {serviceStations.map((station, index) => (
            <Col xs={24} lg={12} xl={8} key={index}>
              <Card size="small" title={station.station || `服务站 ${index + 1}`}>
                <Form layout="vertical">
                  <Form.Item label="服务站名称"><Input value={station.station || ''} onChange={(event) => updateServiceStation(index, { station: event.target.value })} /></Form.Item>
                  <Row gutter={12}>
                    <Col span={12}><Form.Item label="联系人"><Input value={station.contact || ''} onChange={(event) => updateServiceStation(index, { contact: event.target.value })} /></Form.Item></Col>
                    <Col span={12}><Form.Item label="电话"><Input value={station.phone || ''} onChange={(event) => updateServiceStation(index, { phone: event.target.value })} /></Form.Item></Col>
                  </Row>
                  <Form.Item label="地址"><Input value={station.address || ''} onChange={(event) => updateServiceStation(index, { address: event.target.value })} /></Form.Item>
                  <Form.Item label="覆盖区域"><Input.TextArea rows={2} value={station.areas || ''} onChange={(event) => updateServiceStation(index, { areas: event.target.value })} /></Form.Item>
                </Form>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Space>
  );
}

export function ProcessModuleEditor({ items, backgroundImageUrl, onUpdate, onChange, onBackgroundChange }: { items: ProcessItem[]; backgroundImageUrl?: string; onUpdate: (index: number, patch: Partial<ProcessItem>) => void; onChange: (items: ProcessItem[]) => void; onBackgroundChange: (url: string) => void }) {
  const canAddItem = items.length < 4;

  function getGalleryImageUrl(image: ProcessGalleryImage) {
    return typeof image === 'string' ? image : image.imageUrl || '';
  }

  function getGalleryImageTitle(image: ProcessGalleryImage) {
    return typeof image === 'string' ? '' : image.title || '';
  }

  function updateGalleryImage(itemIndex: number, galleryIndex: number, patch: Partial<Exclude<ProcessGalleryImage, string>>) {
    const galleryImages = items[itemIndex]?.galleryImages || [];
    onUpdate(itemIndex, { galleryImages: galleryImages.map((image, imageIndex) => imageIndex === galleryIndex ? { imageUrl: getGalleryImageUrl(image), title: getGalleryImageTitle(image), ...patch } : image) });
  }

  function addItem() {
    if (!canAddItem) return;
    const defaultLinks = ['/process/filling-line', '/process/equipment-management', '/process/equipment', '/process/warehouse'];
    onChange([...items, { title: '', description: '', imageUrl: '', galleryImages: [], linkUrl: defaultLinks[items.length] || defaultLinks[0], sections: [] }]);
  }

  return (
    <div>
      <Card title="背景图片" style={{ marginBottom: 16 }}><Dropzone value={backgroundImageUrl} cropPreset="processBackground" onChange={onBackgroundChange} /></Card>
      <Space style={{ marginBottom: 12 }}><Button type="primary" disabled={!canAddItem} onClick={addItem}>新增项目</Button><Typography.Text type="secondary">最多设置 4 个项目</Typography.Text></Space>
      <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
        {items.map((item, index) => (
          <SectionCard key={index} title={item.title || `项目 ${index + 1}`} description={item.description?.slice(0, 40) || '展开后编辑工艺项目'} extra={<ConfirmButton danger size="small" title="确定删除这个项目吗？" onConfirm={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除</ConfirmButton>}>
            <Row gutter={16}>
              <Col xs={24} lg={12}><Form layout="vertical"><Form.Item label="标题"><Input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></Form.Item><Form.Item label="说明文字"><Input.TextArea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} rows={5} /></Form.Item><FeatureDetailArticleEditor item={item} onUpdate={(patch: Partial<ProcessItem>) => onUpdate(index, patch)} /></Form></Col>
              <Col xs={24} lg={12}>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  <Card title="主图"><Dropzone value={item.imageUrl} cropPreset="processMain" onChange={(url) => onUpdate(index, { imageUrl: url })} /></Card>
                  <Card title="底部轮播图">
                    <Dropzone value="" multiple cropPreset="processGallery" onChange={() => {}} onMultipleChange={(urls) => onUpdate(index, { galleryImages: [...(item.galleryImages || []), ...urls.map((imageUrl) => ({ imageUrl, title: item.title || '' }))].slice(0, 4) })} hint="每个项目最多设置 4 张底部轮播图，上传前裁剪为 275 × 160" />
                    <Row gutter={[8, 8]} style={{ marginTop: 12 }}>{(item.galleryImages || []).map((image, galleryIndex) => {
                      const imageUrl = getGalleryImageUrl(image);
                      return <Col span={12} key={`${imageUrl}-${galleryIndex}`}><Card size="small" cover={<img src={imageUrl} alt="底部轮播图" style={{ width: '100%', aspectRatio: '275 / 160', objectFit: 'cover' }} />} actions={[<Button type="link" danger onClick={() => onUpdate(index, { galleryImages: (item.galleryImages || []).filter((_, imageIndex) => imageIndex !== galleryIndex) })}>移除图片</Button>]}><Form.Item label="小标题"><Input value={getGalleryImageTitle(image)} placeholder={item.title || '请输入小标题'} onChange={(event) => updateGalleryImage(index, galleryIndex, { title: event.target.value })} /></Form.Item></Card></Col>;
                    })}</Row>
                    <Typography.Text type="secondary">已设置 {(item.galleryImages || []).length}/4 张底部轮播图。</Typography.Text>
                  </Card>
                </Space>
              </Col>
            </Row>
          </SectionCard>
        ))}
      </SectionCardGroup>
      {items.length === 0 && <Card><Typography.Text type="secondary">还没有工艺项目，请点击“新增项目”。</Typography.Text></Card>}
    </div>
  );
}

export function AboutEditor({ data, onChange }: { data: AboutData; onChange: (patch: Partial<SectionData>) => void }) {
  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col xs={24} lg={12}><Form.Item label="公司简介"><Input.TextArea rows={8} value={data.body || ''} onChange={(e) => onChange({ body: e.target.value })} /></Form.Item></Col>
        <Col xs={24} lg={12}><Card title="展示图片"><Dropzone value={data.imageUrl} cropPreset="aboutPreview" onChange={(url) => onChange({ imageUrl: url })} /></Card></Col>
      </Row>
    </Form>
  );
}

export function GenericItemsEditor({ title, help, items, onUpdate, onChange }: { title: string; help: string; items: FeatureItem[]; onUpdate: (index: number, patch: Partial<FeatureItem>) => void; onChange: (items: FeatureItem[]) => void }) {
  const rows = items.map((item, index) => ({ ...item, __id: `${index}-${item.title || title}` }));
  return (
    <div>
      <Typography.Paragraph type="secondary">{help}</Typography.Paragraph>
      <Space style={{ marginBottom: 12 }}><Button type="primary" onClick={() => onChange([...items, { title: '', description: '', icon: '◆', linkUrl: '' }])}>新增内容</Button></Space>
      <DraggableList
        items={rows}
        getItemId={(item) => item.__id}
        onReorder={(next) => onChange(next.map(({ __id, ...item }) => item))}
        renderItem={(item, index, dragHandle) => (
          <SectionCard title={item.title || `内容 ${index + 1}`} description={item.description || '展开后编辑内容'} extra={<><DragHandle dragHandle={dragHandle} /><ConfirmButton danger size="small" title="确定删除这条内容吗？" onConfirm={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除</ConfirmButton></>}>
            <Form layout="vertical"><Form.Item label="图标符号"><Input value={item.icon || ''} onChange={(e) => onUpdate(index, { icon: e.target.value })} /></Form.Item><Form.Item label="标题"><Input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></Form.Item><Form.Item label="点击后打开的页面"><Input value={item.linkUrl || ''} onChange={(e) => onUpdate(index, { linkUrl: e.target.value })} placeholder="例如 /benefits/dedicated-manager" /></Form.Item><Form.Item label="说明文字"><Input.TextArea value={item.description || ''} rows={4} onChange={(e) => onUpdate(index, { description: e.target.value })} /></Form.Item></Form>
          </SectionCard>
        )}
      />
    </div>
  );
}

const defaultContactInfoItems: ContactInfoItem[] = [
  { label: '公司名称', value: '桔尔润（北京）润滑油有限公司' },
  { label: '公司地址', value: '北京市大兴区科创五街38号院' },
  { label: '联系电话', value: '0519-68288220' },
  { label: '服务热线', value: '0519-68288220' },
  { label: '电子邮箱', value: 'service@example.com' }
];

function normalizeContactInfoItems(items?: ContactInfoItem[]) {
  return defaultContactInfoItems.map((fallback, index) => ({
    label: items?.[index]?.label || fallback.label,
    value: items?.[index]?.value || fallback.value
  }));
}

export function RichTextArticleEditor({ data, onChange, description = '前台会自动首行缩进、两端对齐，并按富文本文章版式展示。每段正文之间请空一行。' }: { data: LegalStatementData; onChange: (patch: Partial<SectionData>) => void; description?: string }) {
  const sections = data.sections || [];
  const updateSection = (index: number, patch: Partial<LegalStatementSection>) => onChange({ sections: sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, ...patch } : section) });
  const paragraphsToText = (paragraphs?: string[]) => (paragraphs || []).join('\n\n');
  const textToParagraphs = (value: string) => value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);

  return (
    <div>
      <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      <Space style={{ marginBottom: 12 }}><Button type="primary" onClick={() => onChange({ sections: [...sections, { heading: '', paragraphs: [] }] })}>新增章节</Button></Space>
      <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
        {sections.map((section, index) => (
          <SectionCard key={index} title={section.heading || `章节 ${index + 1}`} description={(section.paragraphs || []).join('').slice(0, 40) || '展开后编辑正文'} extra={<ConfirmButton danger size="small" title="确定删除这个章节吗？" onConfirm={() => onChange({ sections: sections.filter((_, sectionIndex) => sectionIndex !== index) })}>删除</ConfirmButton>}>
            <Form layout="vertical">
              <Form.Item label="章节标题"><Input value={section.heading || ''} onChange={(e) => updateSection(index, { heading: e.target.value })} /></Form.Item>
              <Form.Item label="正文段落"><Input.TextArea rows={8} value={paragraphsToText(section.paragraphs)} onChange={(e) => updateSection(index, { paragraphs: textToParagraphs(e.target.value) })} placeholder="每段之间请空一行" /></Form.Item>
            </Form>
          </SectionCard>
        ))}
      </SectionCardGroup>
      {sections.length === 0 && <Card><Typography.Text type="secondary">还没有正文章节，请点击“新增章节”。</Typography.Text></Card>}
    </div>
  );
}

export function LegalStatementEditor({ data, onChange }: { data: LegalStatementData; onChange: (patch: Partial<SectionData>) => void }) {
  const paragraphs = data.sections?.flatMap((section) => section.paragraphs || []) || [];

  return (
    <Card className="legal-statement-admin-card" title="正文内容">
      <Typography.Paragraph type="secondary">正文按关于我们页面的富文本格式展示。每段正文之间请空一行。</Typography.Paragraph>
      <Form.Item label="正文内容"><RichTextArea rows={12} value={paragraphsToText(paragraphs)} onChange={(value) => onChange({ sections: [{ paragraphs: textToParagraphs(value) }] })} placeholder="每段之间请空一行，选中文字后可点击 B 加粗" /></Form.Item>
    </Card>
  );
}

export function ContactInfoEditor({ data, onChange }: { data: ContactInfoData; onChange: (patch: Partial<SectionData>) => void }) {
  const items = normalizeContactInfoItems(data.items);
  const updateItem = (index: number, patch: Partial<ContactInfoItem>) => onChange({ items: items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={10}>
        <Card title="地图图片">
          <Dropzone value={data.mapImageUrl} onChange={(mapImageUrl) => onChange({ mapImageUrl })} hint="建议上传 3:2 比例地图坐标图片。" />
        </Card>
      </Col>
      <Col xs={24} xl={14}>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Card title="联系信息">
            <Space direction="vertical" style={{ width: '100%' }}>
              {items.map((item, index) => (
                <Row gutter={12} key={index}>
                  <Col xs={24} md={8}><Form.Item label={`第 ${index + 1} 条标题`}><Input value={item.label || ''} onChange={(e) => updateItem(index, { label: e.target.value })} /></Form.Item></Col>
                  <Col xs={24} md={16}><Form.Item label="内容"><Input value={item.value || ''} onChange={(e) => updateItem(index, { value: e.target.value })} /></Form.Item></Col>
                </Row>
              ))}
            </Space>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}

export function ContactPanelEditor({ data, onChange }: { data: ContactPanelData; onChange: (patch: Partial<SectionData>) => void }) {
  const industryOptions = data.industryOptions || [];
  const updateIndustryOption = (index: number, value: string) => onChange({ industryOptions: industryOptions.map((item, itemIndex) => itemIndex === index ? value : item) });
  const removeIndustryOption = (index: number) => onChange({ industryOptions: industryOptions.filter((_, itemIndex) => itemIndex !== index) });
  const addIndustryOption = () => onChange({ industryOptions: [...industryOptions, ''] });

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={14}>
        <Card title="渠道合作顾问信息">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={12}><Form.Item label="顾问姓名"><Input value={data.consultantName || ''} placeholder="例如：王经理" onChange={(e) => onChange({ consultantName: e.target.value })} /></Form.Item></Col>
              <Col xs={24} md={12}><Form.Item label="顾问职位"><Input value={data.consultantTitle || ''} placeholder="例如：渠道合作顾问" onChange={(e) => onChange({ consultantTitle: e.target.value })} /></Form.Item></Col>
            </Row>
            <Form.Item label="顾问头像"><Dropzone value={data.consultantAvatarUrl} cropPreset="contactAvatar" onChange={(consultantAvatarUrl) => onChange({ consultantAvatarUrl })} hint="建议上传正方形头像，前台会裁切为圆形展示。" /></Form.Item>
            <Form.Item label="顾问介绍"><Input.TextArea rows={6} value={data.description || ''} placeholder="请输入展示在渠道合作页面的顾问介绍" onChange={(e) => onChange({ description: e.target.value })} /></Form.Item>
            <Form.Item label="按钮文字"><Input value={data.buttonText || ''} placeholder="例如：提交合作咨询" onChange={(e) => onChange({ buttonText: e.target.value })} /></Form.Item>
          </Form>
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        <Card title="所处行业选项" extra={<Button type="primary" onClick={addIndustryOption}>新增行业</Button>}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {industryOptions.map((option, index) => (
              <Space key={index} style={{ width: '100%' }} align="start">
                <Typography.Text style={{ width: 32, lineHeight: '32px' }}>{index + 1}</Typography.Text>
                <Input value={option} placeholder="例如：汽车后市场" onChange={(e) => updateIndustryOption(index, e.target.value)} />
                <ConfirmButton danger title="确定删除这个行业选项吗？" onConfirm={() => removeIndustryOption(index)}>删除</ConfirmButton>
              </Space>
            ))}
            {industryOptions.length === 0 && <Typography.Text type="secondary">还没有行业选项，请点击“新增行业”。</Typography.Text>}
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
