import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getContentSections, getSiteProfile, submitConsultation, type ContentSection, type SiteProfile } from '../api/publicApi';

export function ConsultPage() {
  const [params] = useSearchParams();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [contactPanel, setContactPanel] = useState<ContentSection | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', industry: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteProfile().then(setProfile).catch(() => {});
    getContentSections('consult').then((sections) => setContactPanel(sections.contactPanel || null)).catch(() => {});
  }, []);

  const panelData = contactPanel?.data as { consultantName?: string; consultantTitle?: string; description?: string; buttonText?: string; industryOptions?: string[] } | undefined;
  const defaultIndustryOptions = ['汽车后市场', '工业设备', '渠道代理', '其他'];
  const industryOptions = (panelData?.industryOptions || []).map((item) => item.trim()).filter(Boolean);
  const visibleIndustryOptions = industryOptions.length > 0 ? industryOptions : defaultIndustryOptions;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!form.name.trim() || !form.phone.trim()) {
      setError('请填写姓名和手机号');
      return;
    }

    try {
      await submitConsultation({ ...form, sourcePage: params.get('product') || 'consult' });
      setStatus('提交成功，我们会尽快与您联系。');
      setForm({ name: '', phone: '', industry: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后再试');
    }
  }

  return (
    <main className="gray-page consult-page">
      <div className="container"><h1 className="form-heading">填写需求信息，免费获取产品设计方案</h1></div>
      <div className="container consult-card">
        <aside><h3>{contactPanel?.title || '还有更多疑问?'}</h3><p>在线咨询或者直接拨打电话</p><div className="avatar">工程师</div><b>{panelData?.consultantTitle || '总工程师'}/{panelData?.consultantName || '王作高'}</b><p>{panelData?.description || '这里是学历简介和工作经验'}</p><button>{panelData?.buttonText || '在线咨询'}</button><div className="consult-phone">资讯热线<br /><strong>{profile?.hotline || profile?.phone || '0519-68288220'}</strong></div></aside>
        <section>
          <div className="steps"><span>01填写需求</span><span>02电话对接</span><span>03方案定制</span></div>
          <p>我们将尽快与您取得联系（严格保护您的信息不会泄露，请放心填写）</p>
          <form className="demand-form" onSubmit={onSubmit}>
            {error && <p className="error">{error}</p>}
            {status && <p className="success">{status}</p>}
            <label>您的姓名：<input value={form.name} placeholder="请填写您的称呼" onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label>手机号码：<input value={form.phone} placeholder="请填写您的联系方式" onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
            <label>所处行业：<select value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })}><option value="">请选择您的行业</option>{visibleIndustryOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
            <label>补充说明：<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
            <button>提交方案需求</button>
          </form>
        </section>
      </div>
    </main>
  );
}
