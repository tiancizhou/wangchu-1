import { ImageUploader } from './ImageUploader';

export type FeatureItem = { title?: string; description?: string; icon?: string; linkUrl?: string };
export type SupportTab = { title?: string; heading?: string; description?: string; imageUrl?: string; thumbnails?: string[] };
export type ProcessItem = { title?: string; description?: string; imageUrl?: string };
export type AboutData = { imageUrl?: string; body?: string; linkUrl?: string };
export type ContactPanelData = { consultantName?: string; consultantTitle?: string; description?: string; buttonText?: string; industryOptions?: string[] };
export type SectionData = {
  items?: FeatureItem[] | ProcessItem[];
  tabs?: SupportTab[];
  imageUrl?: string;
  backgroundImageUrl?: string;
  body?: string;
  linkUrl?: string;
  consultantName?: string;
  consultantTitle?: string;
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

export function FeatureCardsEditor({ items, onUpdate, onChange, mode = 'default' }: { items: FeatureItem[]; onUpdate: (index: number, patch: Partial<FeatureItem>) => void; onChange: (items: FeatureItem[]) => void; mode?: 'default' | 'simpleEnterprise' }) {
  if (mode === 'simpleEnterprise') return <SimpleEnterpriseCardsEditor items={items} onUpdate={onUpdate} />;
  return <div className="admin-subsection"><h2>企业管理模块</h2><p className="field-help">建议保持 4 个卡片，标题尽量简短，说明控制在一两句话。</p>{items.map((item, index) => <div className="content-item-editor" key={index}><h3>卡片 {index + 1}</h3><div className="inline-editor inline-editor-four"><label>图标符号<input placeholder="例如 ✥、●" value={item.icon || ''} onChange={(e) => onUpdate(index, { icon: e.target.value })} /></label><label>卡片标题<input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></label><label>点击后打开的页面<input placeholder="例如 /consult" value={item.linkUrl || ''} onChange={(e) => onUpdate(index, { linkUrl: e.target.value })} /></label><button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除卡片</button></div><label>卡片说明<textarea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} /></label></div>)}<button type="button" onClick={() => onChange([...items, { title: '', description: '', icon: '✥', linkUrl: '/consult' }])}>新增模块卡片</button></div>;
}

function SimpleEnterpriseCardsEditor({ items, onUpdate }: { items: FeatureItem[]; onUpdate: (index: number, patch: Partial<FeatureItem>) => void }) {
  return (
    <div className="admin-subsection simple-enterprise-editor">
      <div className="section-editor-title">
        <div><h2>编辑首页卡片</h2><p className="field-help">每张卡片只需要填写标题和说明。建议保持 4 张卡片，保存后会同步到首页。</p></div>
      </div>
      <div className="simple-enterprise-card-list">
        {items.map((item, index) => (
          <article className="content-item-editor simple-enterprise-card" key={index}>
            <div className="simple-enterprise-fields">
              <h3>第 {index + 1} 张卡片</h3>
              <label>首页显示标题<input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></label>
              <label>首页显示说明<textarea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} /></label>
            </div>
            <div className="simple-card-preview" aria-label={`第 ${index + 1} 张卡片预览`}>
              <b>{item.icon || '✥'}</b>
              <h4>{item.title || `卡片 ${index + 1}`}</h4>
              <p>{item.description || '这里会显示首页卡片说明。'}</p>
              <span>了解更多</span>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && <p className="empty-state">还没有卡片，请到首页内容管理中恢复默认卡片。</p>}
    </div>
  );
}

export function SupportModuleEditor({ tabs, onUpdate, onChange }: { tabs: SupportTab[]; onUpdate: (index: number, patch: Partial<SupportTab>) => void; onChange: (tabs: SupportTab[]) => void }) {
  return (
    <div className="admin-subsection section-editor section-editor-support">
      <div className="section-editor-title">
        <div><h2>生产设计栏目</h2><p className="field-help">每个栏目对应首页左侧一个按钮，中间图片、右侧文字和底部轮播图片会跟随切换。</p></div>
        <button className="section-add-button" type="button" onClick={() => onChange([...tabs, { title: '', heading: '', description: '', imageUrl: '', thumbnails: [] }])}>新增栏目</button>
      </div>
      {tabs.map((tab, index) => (
        <article className="content-item-editor section-edit-card support-edit-card" key={index}>
          <div className="section-edit-card-head"><div><span>栏目 {index + 1}</span><h3>{tab.title || '未命名栏目'}</h3></div><button className="section-delete-button" type="button" onClick={() => onChange(tabs.filter((_, tabIndex) => tabIndex !== index))}>删除栏目</button></div>
          <div className="section-field-grid">
            <label>左侧栏目名称<input value={tab.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></label>
            <label>右侧标题<input value={tab.heading || ''} onChange={(e) => onUpdate(index, { heading: e.target.value })} /></label>
          </div>
          <label className="section-full-field">右侧说明文字<textarea value={tab.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} /></label>
          <div className="section-media-grid">
            <div className="section-media-block">
              <div className="section-block-title"><h4>模块主图</h4><p>显示在首页模块中间的大图，建议使用横向生产场景图。</p></div>
              <ImageUploader value={tab.imageUrl} onChange={(url) => onUpdate(index, { imageUrl: url })} />
            </div>
            <div className="section-media-block">
              <div className="section-block-title"><h4>底部轮播图片</h4><p>可一次上传多张，前台底部左右箭头会切换这些图片。</p></div>
              <ImageUploader value="" multiple onChange={() => {}} onMultipleChange={(urls) => onUpdate(index, { thumbnails: [...(tab.thumbnails || []), ...urls] })} />
              <div className="admin-image-list section-thumbnail-list">{(tab.thumbnails || []).map((url) => <figure key={url}><img src={url} alt="底部轮播图" /><button type="button" onClick={() => onUpdate(index, { thumbnails: (tab.thumbnails || []).filter((item) => item !== url) })}>移除图片</button></figure>)}</div>
            </div>
          </div>
        </article>
      ))}
      {tabs.length === 0 && <p className="empty-state">还没有生产设计栏目，请点击“新增栏目”。</p>}
    </div>
  );
}

export function ProcessModuleEditor({ items, backgroundImageUrl, onUpdate, onChange, onBackgroundChange }: { items: ProcessItem[]; backgroundImageUrl?: string; onUpdate: (index: number, patch: Partial<ProcessItem>) => void; onChange: (items: ProcessItem[]) => void; onBackgroundChange: (url: string) => void }) {
  return (
    <div className="admin-subsection section-editor section-editor-process">
      <div className="section-editor-title">
        <div><h2>工艺项目</h2><p className="field-help">用于首页“先进的制作工艺”区域，建议填写 3 到 4 个项目，并设置一张深色背景图。</p></div>
        <button className="section-add-button" type="button" onClick={() => onChange([...items, { title: '', description: '', imageUrl: '' }])}>新增工艺项目</button>
      </div>
      <div className="section-media-block process-background-edit">
        <div className="section-block-title"><h4>模块背景图片</h4><p>显示在整个“先进的制作工艺”模块后方，建议使用设备、生产线或工厂环境横图。</p></div>
        <ImageUploader value={backgroundImageUrl} onChange={onBackgroundChange} />
      </div>
      {items.map((item, index) => (
        <article className="content-item-editor section-edit-card process-edit-card" key={index}>
          <div className="section-edit-card-head"><div><span>工艺项目 {index + 1}</span><h3>{item.title || '未命名项目'}</h3></div><button className="section-delete-button" type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除项目</button></div>
          <div className="section-split-card">
            <div className="section-fields-stack">
              <label>项目标题<input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></label>
              <label>项目说明<textarea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} /></label>
            </div>
            <div className="section-media-block">
              <div className="section-block-title"><h4>项目图片</h4><p>显示在工艺区域卡片中，建议上传设备、检测或生产细节图。</p></div>
              <ImageUploader value={item.imageUrl} onChange={(url) => onUpdate(index, { imageUrl: url })} />
            </div>
          </div>
        </article>
      ))}
      {items.length === 0 && <p className="empty-state">还没有工艺项目，请点击“新增工艺项目”。</p>}
    </div>
  );
}

export function AboutEditor({ data, onChange }: { data: AboutData; onChange: (patch: Partial<SectionData>) => void }) {
  return (
    <div className="admin-subsection section-editor section-editor-about">
      <div className="section-editor-title"><div><h2>关于我们预览</h2><p className="field-help">这段内容显示在首页关于我们区域，左侧为图片，右侧为公司简介和入口链接。</p></div></div>
      <div className="about-edit-layout">
        <div className="section-fields-stack">
          <label>点击后打开的页面<input placeholder="例如 /#about；不确定可保持默认" value={data.linkUrl || ''} onChange={(e) => onChange({ linkUrl: e.target.value })} /></label>
          <label>公司简介<textarea value={data.body || ''} onChange={(e) => onChange({ body: e.target.value })} /></label>
        </div>
        <div className="section-media-block about-image-edit">
          <div className="section-block-title"><h4>关于我们图片</h4><p>显示在首页“关于我们”区域，建议使用厂区、团队或生产环境图片。</p></div>
          <ImageUploader value={data.imageUrl} onChange={(url) => onChange({ imageUrl: url })} />
        </div>
      </div>
    </div>
  );
}

export function GenericItemsEditor({ title, help, items, onUpdate, onChange }: { title: string; help: string; items: FeatureItem[]; onUpdate: (index: number, patch: Partial<FeatureItem>) => void; onChange: (items: FeatureItem[]) => void }) {
  return <div className="admin-subsection"><h2>{title}</h2><p className="field-help">{help}</p>{items.map((item, index) => <div className="content-item-editor" key={index}><h3>内容 {index + 1}</h3><div className="inline-editor"><label>图标符号<input placeholder="例如 ◆、👍" value={item.icon || ''} onChange={(e) => onUpdate(index, { icon: e.target.value })} /></label><label>标题<input value={item.title || ''} onChange={(e) => onUpdate(index, { title: e.target.value })} /></label><button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>删除内容</button></div><label>说明文字<textarea value={item.description || ''} onChange={(e) => onUpdate(index, { description: e.target.value })} /></label></div>)}<button type="button" onClick={() => onChange([...items, { title: '', description: '', icon: '◆' }])}>新增内容</button></div>;
}

export function ContactPanelEditor({ data, onChange }: { data: ContactPanelData; onChange: (patch: Partial<SectionData>) => void }) {
  const industryOptions = data.industryOptions || [];
  const updateIndustryOption = (index: number, value: string) => onChange({ industryOptions: industryOptions.map((item, itemIndex) => itemIndex === index ? value : item) });
  const removeIndustryOption = (index: number) => onChange({ industryOptions: industryOptions.filter((_, itemIndex) => itemIndex !== index) });
  const addIndustryOption = () => onChange({ industryOptions: [...industryOptions, ''] });

  return (
    <div className="admin-subsection contact-panel-editor">
      <h2>渠道合作顾问信息</h2>
      <p className="field-help">这段内容显示在渠道合作咨询页，用于引导客户提交咨询。</p>
      <div className="inline-editor">
        <label>顾问姓名<input value={data.consultantName || ''} onChange={(e) => onChange({ consultantName: e.target.value })} /></label>
        <label>顾问职位<input value={data.consultantTitle || ''} onChange={(e) => onChange({ consultantTitle: e.target.value })} /></label>
      </div>
      <label>顾问介绍<textarea value={data.description || ''} onChange={(e) => onChange({ description: e.target.value })} /></label>
      <label>按钮文字<input value={data.buttonText || ''} onChange={(e) => onChange({ buttonText: e.target.value })} /></label>
      <div className="industry-option-editor">
        <div className="industry-option-title"><div><h3>所处行业选项</h3><p>客户在渠道合作咨询页下拉框中会看到这些选项。</p></div><button type="button" onClick={addIndustryOption}>新增行业</button></div>
        <div className="industry-option-list">
          {industryOptions.map((option, index) => <div className="industry-option-row" key={index}><span>{index + 1}</span><input value={option} placeholder="例如：汽车后市场" onChange={(e) => updateIndustryOption(index, e.target.value)} /><button type="button" onClick={() => removeIndustryOption(index)}>删除</button></div>)}
        </div>
        {industryOptions.length === 0 && <p className="empty-state">还没有行业选项，请点击“新增行业”。</p>}
      </div>
    </div>
  );
}
