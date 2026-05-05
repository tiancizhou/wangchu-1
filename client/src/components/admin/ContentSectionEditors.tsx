import { Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import { ConfirmButton, Dropzone, DragHandle, DraggableList, SectionCard, SectionCardGroup } from '../../admin/components';

export type FeatureItem = { title?: string; description?: string; icon?: string; linkUrl?: string };
export type SupportTab = { title?: string; heading?: string; description?: string; imageUrl?: string; thumbnails?: string[] };
export type ProcessItem = { title?: string; description?: string; imageUrl?: string };
export type AboutData = { imageUrl?: string; body?: string; linkUrl?: string };
export type ContactPanelData = { consultantName?: string; consultantTitle?: string; consultantAvatarUrl?: string; description?: string; buttonText?: string; industryOptions?: string[] };
export type SectionData = {
  items?: FeatureItem[] | ProcessItem[];
  tabs?: SupportTab[];
  imageUrl?: string;
  backgroundImageUrl?: string;
  body?: string;
  linkUrl?: string;
  consultantName?: string;
  consultantTitle?: string;
  consultantAvatarUrl?: string;
  description?: string;
  buttonText?: string;
  industryOptions?: string[];
};

export const sectionNames: Record<string, string> = {
  featureCards: '企业管理模块',
  supportModule: '生产设计与制作',
  processModule: '先进的制作工艺',
  aboutPreview: '关于我们',
  advantages: '加盟优势',
  benefits: '加盟福利',
  contactPanel: '咨询页顾问信息'
};

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
              <Form.Item label="点击后打开的页面"><Input value={item.linkUrl || ''} onChange={(e) => onUpdate(index, { linkUrl: e.target.value })} placeholder="例如 /consult" /></Form.Item>
              <Form.Item label="首页显示说明"><Input.TextArea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} rows={4} /></Form.Item>
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
    onChange([...tabs, { title: '', heading: '', description: '', imageUrl: '', thumbnails: [] }]);
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
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}><Card title="主图"><Dropzone value={tab.imageUrl} onChange={(url) => onUpdate(index, { imageUrl: url })} /></Card></Col>
                <Col xs={24} lg={12}><Card title="轮播图片"><Dropzone value="" multiple onChange={() => {}} onMultipleChange={(urls) => onUpdate(index, { thumbnails: [...(tab.thumbnails || []), ...urls] })} /><Row gutter={[8, 8]} style={{ marginTop: 12 }}>{(tab.thumbnails || []).map((url) => <Col span={12} key={url}><Card size="small" cover={<img src={url} alt="底部轮播图" style={{ height: 90, objectFit: 'cover' }} />} actions={[<Button type="link" danger onClick={() => onUpdate(index, { thumbnails: (tab.thumbnails || []).filter((item) => item !== url) })}>移除图片</Button>]} /></Col>)}</Row></Card></Col>
              </Row>
            </Form>
          </SectionCard>
        ))}
      </SectionCardGroup>
      {tabs.length === 0 && <Card><Typography.Text type="secondary">还没有生产设计栏目，请点击“新增栏目”。</Typography.Text></Card>}
    </div>
  );
}

export function ProcessModuleEditor({ items, backgroundImageUrl, onUpdate, onChange, onBackgroundChange }: { items: ProcessItem[]; backgroundImageUrl?: string; onUpdate: (index: number, patch: Partial<ProcessItem>) => void; onChange: (items: ProcessItem[]) => void; onBackgroundChange: (url: string) => void }) {
  const canAddItem = items.length < 4;

  function addItem() {
    if (!canAddItem) return;
    onChange([...items, { title: '', description: '', imageUrl: '' }]);
  }

  return (
    <div>
      <Card title="背景图片" style={{ marginBottom: 16 }}><Dropzone value={backgroundImageUrl} onChange={onBackgroundChange} /></Card>
      <Space style={{ marginBottom: 12 }}><Button type="primary" disabled={!canAddItem} onClick={addItem}>新增项目</Button><Typography.Text type="secondary">最多设置 4 个项目</Typography.Text></Space>
      <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
        {items.map((item, index) => (
          <SectionCard key={index} title={item.title || `项目 ${index + 1}`} description={item.description?.slice(0, 40) || '展开后编辑工艺项目'} extra={<ConfirmButton danger size="small" title="确定删除这个项目吗？" onConfirm={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除</ConfirmButton>}>
            <Row gutter={16}>
              <Col xs={24} lg={12}><Form layout="vertical"><Form.Item label="标题"><Input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></Form.Item><Form.Item label="说明文字"><Input.TextArea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} rows={5} /></Form.Item></Form></Col>
              <Col xs={24} lg={12}><Card title="图片"><Dropzone value={item.imageUrl} onChange={(url) => onUpdate(index, { imageUrl: url })} /></Card></Col>
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
        <Col xs={24} lg={12}><Form.Item label="跳转页面"><Input placeholder="例如 /#about" value={data.linkUrl || ''} onChange={(e) => onChange({ linkUrl: e.target.value })} /></Form.Item><Form.Item label="公司简介"><Input.TextArea rows={8} value={data.body || ''} onChange={(e) => onChange({ body: e.target.value })} /></Form.Item></Col>
        <Col xs={24} lg={12}><Card title="展示图片"><Dropzone value={data.imageUrl} onChange={(url) => onChange({ imageUrl: url })} /></Card></Col>
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
            <Form.Item label="顾问头像"><Dropzone value={data.consultantAvatarUrl} onChange={(consultantAvatarUrl) => onChange({ consultantAvatarUrl })} hint="建议上传正方形头像，前台会裁切为圆形展示。" /></Form.Item>
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
