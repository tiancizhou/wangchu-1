import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getNavigation, getSiteProfile, type NavigationItem, type SiteProfile } from '../../api/publicApi';

const fallbackProfile: SiteProfile = {
  id: '',
  companyName: '桔尔润（北京）润滑油有限公司',
  logoUrl: '',
  footerLogoUrl: '',
  phone: '0519-68288220',
  hotline: '0519-68288220',
  address: '北京市大兴区科创五街38号院',
  email: '',
  footerText: '专注润滑油产品研发、生产与渠道服务',
  footerLinksJson: '[]',
  footerLinks: [
    { label: '链接名称', url: '#' },
    { label: '链接名称', url: '#' },
    { label: '链接名称', url: '#' },
    { label: '链接名称', url: '#' }
  ],
  footerLinkTitle: '友情链接：',
  legalLabel: '法律声明',
  legalUrl: '/legal',
  contactLabel: '联系我们',
  contactUrl: '/contact',
  copyrightText: '© 2003--现在 Taobao.com 版权所有',
  policeFilingText: '浙公网安备 33011002017548号',
  policeFilingUrl: '#',
  icpText: '浙ICP备2024141841号--1',
  icpUrl: '#',
  seoTitle: '王储润滑油官网',
  seoDescription: ''
};

const publicViewport = 'width=1200';

const fallbackNavigation: NavigationItem[] = [
  { id: 'home', label: '首页', url: '/', sortOrder: 1, isVisible: true, openInNewTab: false },
  { id: 'products', label: '产品中心', url: '/products', sortOrder: 2, isVisible: true, openInNewTab: false },
  { id: 'support', label: '技术支持', url: '/support', sortOrder: 3, isVisible: true, openInNewTab: false },
  { id: 'consult', label: '渠道合作', url: '/consult', sortOrder: 4, isVisible: true, openInNewTab: false },
  { id: 'about', label: '关于我们', url: '/about', sortOrder: 5, isVisible: true, openInNewTab: false }
];

function normalizeNavigationItem(item: NavigationItem): NavigationItem {
  if (item.label === '技术支持' && item.url === '/#support') return { ...item, url: '/support' };
  return item.label === '关于我们' && item.url === '/#about' ? { ...item, url: '/about' } : item;
}

function normalizeHref(url?: string) {
  if (!url || url === '#') return '#';
  if (url.startsWith('/') || url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  return `https://${url}`;
}

function footerEntryUrl(label?: string, url?: string) {
  if ((label === fallbackProfile.legalLabel || label === '法律声明') && (!url || url === '#')) return fallbackProfile.legalUrl;
  if ((label === fallbackProfile.contactLabel || label === '联系我们') && (!url || url === '#')) return fallbackProfile.contactUrl;
  return url;
}

function FooterLink({ label, url }: { label?: string; url?: string }) {
  const text = label || '';
  const href = normalizeHref(footerEntryUrl(label, url));
  if (!text) return null;
  return href.startsWith('/') ? <Link to={href}>{text}</Link> : <a href={href}>{text}</a>;
}

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [profile, setProfile] = useState<SiteProfile>(fallbackProfile);
  const [navigation, setNavigation] = useState<NavigationItem[]>(fallbackNavigation);
  const visibleFooterLinks = (profile.footerLinks?.length ? profile.footerLinks : fallbackProfile.footerLinks || []).filter((link) => link.label).slice(0, 4);
  const footerLogoUrl = profile.footerLogoUrl || profile.logoUrl;

  useEffect(() => {
    const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (viewport) viewport.content = publicViewport;
    getSiteProfile().then((data) => data && setProfile(data)).catch(() => {});
    getNavigation().then((items) => items.length > 0 && setNavigation(items.map(normalizeNavigationItem))).catch(() => {});
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    window.requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [location.pathname, location.hash]);

  return (
    <div className={isHome ? 'public-site public-site-home' : 'public-site'}>
      <header className={isHome ? 'site-header site-header-home' : 'site-header'}>
        <Link to="/" className="brand">
          {profile.logoUrl
            ? <span className="brand-logo-frame"><img className="brand-logo brand-logo-full" src={profile.logoUrl} alt={profile.companyName} /></span>
            : <><span className="brand-mark">K</span><span><b>Kronprins</b><small>王储</small></span></>}
        </Link>
        <nav>
          {navigation.map((item) => item.url.startsWith('/') && !item.openInNewTab
            ? <Link to={item.url} key={item.id}>{item.label}</Link>
            : <a href={item.url} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noreferrer' : undefined} key={item.id}>{item.label}</a>)}
        </nav>
        <div className="phone">☎ {profile.phone || profile.hotline || fallbackProfile.phone}</div>
      </header>
      <Outlet />
      <footer className="site-footer">
        <section className="footer-profile">
          <div className="footer-profile-inner">
            <div className="brand footer-brand">
              {footerLogoUrl
                ? <span className="footer-logo-frame"><img className="brand-logo brand-logo-full" src={footerLogoUrl} alt={profile.companyName} /></span>
                : <><span className="brand-mark">K</span><span><b>Kronprins</b><small>王储</small></span></>}
            </div>
            <div className="footer-company">
              <strong>{profile.companyName || fallbackProfile.companyName}</strong>
              <span>{profile.address || fallbackProfile.address}</span>
            </div>
          </div>
        </section>
        <section className="footer-legal">
          <div className="footer-links">
            <span>{profile.footerLinkTitle || fallbackProfile.footerLinkTitle}</span>
            {visibleFooterLinks.map((link, index) => <a href={normalizeHref(link.url)} key={index}>{link.label}</a>)}
            <FooterLink label={profile.legalLabel || fallbackProfile.legalLabel} url={profile.legalUrl || fallbackProfile.legalUrl} />
            <FooterLink label={profile.contactLabel || fallbackProfile.contactLabel} url={profile.contactUrl || fallbackProfile.contactUrl} />
          </div>
          <p>
            {profile.copyrightText || fallbackProfile.copyrightText}
            {(profile.policeFilingText || fallbackProfile.policeFilingText) && <>　<a href={normalizeHref(profile.policeFilingUrl)}>{profile.policeFilingText || fallbackProfile.policeFilingText}</a></>}
            {(profile.icpText || fallbackProfile.icpText) && <>　<a href={normalizeHref(profile.icpUrl)}>{profile.icpText || fallbackProfile.icpText}</a></>}
          </p>
        </section>
      </footer>
    </div>
  );
}
