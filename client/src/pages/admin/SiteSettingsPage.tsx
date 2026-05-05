import { useEffect, useState } from 'react';
import { adminSiteProfile, saveSiteProfile } from '../../api/adminApi';
import type { FooterLink, SiteProfile } from '../../api/publicApi';
import { ImageUploader } from '../../components/admin/ImageUploader';

const defaultFooterLinks: FooterLink[] = [
  { label: '链接名称', url: '#' },
  { label: '链接名称', url: '#' },
  { label: '链接名称', url: '#' },
  { label: '链接名称', url: '#' },
  { label: '链接名称', url: '#' },
  { label: '链接名称', url: '#' }
];

const emptyProfile: Partial<SiteProfile> = {
  companyName: '',
  logoUrl: '',
  phone: '',
  hotline: '',
  address: '',
  email: '',
  footerText: '',
  footerLinksJson: '[]',
  footerLinks: defaultFooterLinks,
  footerLinkTitle: '友情链接：',
  legalLabel: '法律声明',
  legalUrl: '#',
  contactLabel: '联系我们',
  contactUrl: '#',
  copyrightText: '© 2003--现在 Taobao.com 版权所有',
  policeFilingText: '浙公网安备 33011002017548号',
  policeFilingUrl: '#',
  icpText: '浙ICP备2024141841号--1',
  icpUrl: '#',
  seoTitle: '',
  seoDescription: ''
};

export function SiteSettingsPage() {
  const [profile, setProfile] = useState<Partial<SiteProfile>>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await adminSiteProfile();
        if (data) setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '基础信息加载失败');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function setField<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setMessage('');
  }

  function setFooterLink(index: number, key: keyof FooterLink, value: string) {
    const links = [...(profile.footerLinks || [])];
    links[index] = { ...(links[index] || { label: '', url: '' }), [key]: value };
    setField('footerLinks', links);
  }

  function addFooterLink() {
    setField('footerLinks', [...(profile.footerLinks || []), { label: '', url: '#' }]);
  }

  function removeFooterLink(index: number) {
    setField('footerLinks', (profile.footerLinks || []).filter((_, itemIndex) => itemIndex !== index));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      setProfile(await saveSiteProfile({
        ...profile,
        footerLinksJson: JSON.stringify(profile.footerLinks || [])
      }));
      setMessage('基础信息已保存');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel site-settings-page">
      <div className="admin-title-block site-settings-title">
        <span className="page-editor-label">页脚</span>
        <h1>页脚</h1>
        <p>维护页脚中展示的公司信息、联系方式、友情链接、备案信息和搜索展示信息。</p>
      </div>
      {loading && <p className="page-loading">页脚信息加载中...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      {!loading && (
        <form className="site-settings-layout" onSubmit={onSubmit}>
          <div className="site-settings-main">
            <div className="admin-subsection site-settings-card">
              <div className="site-settings-card-title"><span>01</span><div><h2>公司信息</h2><p>这些内容会出现在网站顶部、页脚和联系区域。</p></div></div>
              <div className="site-field-grid">
                <label>公司名称<input value={profile.companyName || ''} onChange={(e) => setField('companyName', e.target.value)} /></label>
                <label>联系邮箱<input value={profile.email || ''} onChange={(e) => setField('email', e.target.value)} /></label>
              </div>
              <label>公司地址<input value={profile.address || ''} onChange={(e) => setField('address', e.target.value)} /></label>
            </div>

            <div className="admin-subsection site-settings-card">
              <div className="site-settings-card-title"><span>02</span><div><h2>联系方式</h2><p>用于顶部电话、产品详情和咨询转化位置。</p></div></div>
              <div className="site-field-grid">
                <label>网站顶部电话<input value={profile.phone || ''} onChange={(e) => setField('phone', e.target.value)} /></label>
                <label>客户咨询热线<input value={profile.hotline || ''} onChange={(e) => setField('hotline', e.target.value)} /></label>
              </div>
            </div>

            <div className="admin-subsection site-settings-card">
              <div className="site-settings-card-title"><span>03</span><div><h2>页脚信息</h2><p>用于网站底部友情链接、法律入口、版权和备案信息。</p></div></div>
              <label>页脚文案<textarea value={profile.footerText || ''} onChange={(e) => setField('footerText', e.target.value)} /></label>
              <label>友情链接标题<input value={profile.footerLinkTitle || ''} onChange={(e) => setField('footerLinkTitle', e.target.value)} /></label>
              <div className="footer-link-editor-list">
                {(profile.footerLinks || []).map((link, index) => (
                  <div className="inline-editor footer-link-editor" key={index}>
                    <input placeholder="链接名称" value={link.label || ''} onChange={(e) => setFooterLink(index, 'label', e.target.value)} />
                    <input placeholder="链接地址" value={link.url || ''} onChange={(e) => setFooterLink(index, 'url', e.target.value)} />
                    <button type="button" onClick={() => removeFooterLink(index)}>删除</button>
                  </div>
                ))}
                <button className="secondary-admin-button" type="button" onClick={addFooterLink}>新增友情链接</button>
              </div>
              <div className="site-field-grid">
                <label>法律声明文案<input value={profile.legalLabel || ''} onChange={(e) => setField('legalLabel', e.target.value)} /></label>
                <label>法律声明链接<input value={profile.legalUrl || ''} onChange={(e) => setField('legalUrl', e.target.value)} /></label>
                <label>联系我们文案<input value={profile.contactLabel || ''} onChange={(e) => setField('contactLabel', e.target.value)} /></label>
                <label>联系我们链接<input value={profile.contactUrl || ''} onChange={(e) => setField('contactUrl', e.target.value)} /></label>
              </div>
              <label>版权文本<input value={profile.copyrightText || ''} onChange={(e) => setField('copyrightText', e.target.value)} /></label>
              <div className="site-field-grid">
                <label>公安备案文本<input value={profile.policeFilingText || ''} onChange={(e) => setField('policeFilingText', e.target.value)} /></label>
                <label>公安备案链接<input value={profile.policeFilingUrl || ''} onChange={(e) => setField('policeFilingUrl', e.target.value)} /></label>
                <label>ICP备案文本<input value={profile.icpText || ''} onChange={(e) => setField('icpText', e.target.value)} /></label>
                <label>ICP备案链接<input value={profile.icpUrl || ''} onChange={(e) => setField('icpUrl', e.target.value)} /></label>
              </div>
            </div>

            <div className="admin-subsection site-settings-card">
              <div className="site-settings-card-title"><span>04</span><div><h2>搜索设置（可选）</h2><p>用于浏览器标题和搜索引擎展示，不确定可以先保持默认。</p></div></div>
              <label>浏览器标题 / 搜索标题<input value={profile.seoTitle || ''} onChange={(e) => setField('seoTitle', e.target.value)} /></label>
              <label>搜索结果简介<textarea value={profile.seoDescription || ''} onChange={(e) => setField('seoDescription', e.target.value)} /></label>
            </div>
          </div>

          <aside className="site-settings-side">
            <div className="site-logo-panel">
              <h2>公司 Logo</h2>
              <p>建议使用透明背景 PNG 或 WebP 图片。</p>
              <ImageUploader value={profile.logoUrl} onChange={(url) => setField('logoUrl', url)} />
            </div>
            <div className="site-profile-preview">
              <span>页面预览</span>
              <strong>{profile.companyName || '公司名称'}</strong>
              <p>{profile.address || '公司地址会显示在这里'}</p>
              <dl>
                <div><dt>顶部电话</dt><dd>{profile.phone || '未填写'}</dd></div>
                <div><dt>咨询热线</dt><dd>{profile.hotline || '未填写'}</dd></div>
                <div><dt>邮箱</dt><dd>{profile.email || '未填写'}</dd></div>
              </dl>
            </div>
            <div className="site-settings-actions">
              <button disabled={saving}>{saving ? '保存中...' : '保存基础信息'}</button>
              <p>{message || '保存后，前台刷新即可看到最新基础资料。'}</p>
            </div>
          </aside>
        </form>
      )}
    </section>
  );
}
