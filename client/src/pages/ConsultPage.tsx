import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getContentSections, getSiteProfile, submitConsultation, type ContentSection, type SiteProfile } from '../api/publicApi';

export function ConsultPage() {
  const [params] = useSearchParams();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [contactPanel, setContactPanel] = useState<ContentSection | null>(null);
  const emptyForm = { name: '', phone: '', industry: '', message: '' };
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSiteProfile().then(setProfile).catch(() => {});
    getContentSections('consult').then((sections) => setContactPanel(sections.contactPanel || null)).catch(() => {});
  }, []);

  const panelData = contactPanel?.data as { consultantName?: string; consultantTitle?: string; consultantAvatarUrl?: string; description?: string; buttonText?: string; industryOptions?: string[] } | undefined;
  const defaultIndustryOptions = ['汽车后市场', '工业设备', '渠道代理', '其他'];
  const industryOptions = (panelData?.industryOptions || []).map((item) => item.trim()).filter(Boolean);
  const visibleIndustryOptions = industryOptions.length > 0 ? industryOptions : defaultIndustryOptions;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submittingRef.current) return;
    setError('');

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      industry: form.industry,
      message: form.message,
      sourcePage: params.get('product') || 'consult'
    };

    if (!payload.name || !payload.phone) {
      setError('请填写姓名和手机号');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await submitConsultation(payload);
      setForm(emptyForm);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败，请稍后再试');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function restartForm() {
    setError('');
    setForm(emptyForm);
    setSubmitted(false);
  }

  return (
    <main className="gray-page consult-page">
      <div className="container"><h1 className="form-heading">填写需求信息，免费获取产品设计方案</h1></div>
      <div className="container consult-card">
        <aside><h3>{contactPanel?.title || '还有更多疑问?'}</h3><p>在线咨询或者直接拨打电话</p><div className="avatar">{panelData?.consultantAvatarUrl ? <img src={panelData.consultantAvatarUrl} alt={panelData?.consultantName || '渠道合作顾问'} /> : '工程师'}</div><b>{panelData?.consultantTitle || '总工程师'}/{panelData?.consultantName || '王作高'}</b><p>{panelData?.description || '这里是学历简介和工作经验'}</p><button>{panelData?.buttonText || '在线咨询'}</button><div className="consult-phone">资讯热线<br /><strong>{profile?.hotline || profile?.phone || '0519-68288220'}</strong></div></aside>
        <section>
          {submitted ? (
            <div className="consult-success-page">
              <div className="consult-success-icon">✓</div>
              <h2>提交成功</h2>
              <p>您的方案需求已提交，我们会尽快与您电话对接。</p>
              <button type="button" onClick={restartForm}>重新填写需求</button>
            </div>
          ) : (
            <>
              <div className="steps"><span>01填写需求</span><span>02电话对接</span><span>03方案定制</span></div>
              <p>我们将尽快与您取得联系（严格保护您的信息不会泄露，请放心填写）</p>
              <form className="demand-form" onSubmit={onSubmit}>
                {error && <p className="error">{error}</p>}
                <label>您的姓名：<input value={form.name} placeholder="请填写您的称呼" onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                <label>手机号码：<input value={form.phone} placeholder="请填写您的联系方式" onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label>所处行业：<select value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })}><option value="">请选择您的行业</option>{visibleIndustryOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
                <label>补充说明：<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
                <button disabled={submitting}>{submitting ? '提交中...' : '提交方案需求'}</button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
