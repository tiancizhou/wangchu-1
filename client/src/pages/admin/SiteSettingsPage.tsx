import { useEffect, useState } from 'react';
import { App, Button, Card, Col, Form, Input, Row, Space, Typography } from 'antd';
import { adminSiteProfile, saveSiteProfile } from '../../api/adminApi';
import type { FooterLink, SiteProfile } from '../../api/publicApi';
import { ConfirmButton, Dropzone, PageHeader, SectionCard, SectionCardGroup } from '../../admin/components';

const maxFooterLinks = 4;

const defaultFooterLinks: FooterLink[] = Array.from({ length: maxFooterLinks }, () => ({ label: '链接名称', url: '#' }));

const emptyProfile: Partial<SiteProfile> = {
  companyName: '',
  logoUrl: '',
  footerLogoUrl: '',
  phone: '',
  hotline: '',
  address: '',
  email: '',
  footerText: '',
  footerLinksJson: '[]',
  footerLinks: defaultFooterLinks,
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
  seoTitle: '',
  seoDescription: ''
};

export function SiteSettingsPage() {
  const [profile, setProfile] = useState<Partial<SiteProfile>>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<Partial<SiteProfile>>();
  const { message } = App.useApp();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await adminSiteProfile();
        const next = data ? { ...data, footerLinks: (data.footerLinks?.length ? data.footerLinks : defaultFooterLinks).slice(0, maxFooterLinks) } : emptyProfile;
        setProfile(next);
        form.setFieldsValue(next);
      } catch (err) {
        message.error(err instanceof Error ? err.message : '基础信息加载失败');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [form, message]);

  function setField<K extends keyof SiteProfile>(key: K, value: SiteProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
    form.setFieldValue(key, value);
  }

  function setFooterLink(index: number, key: keyof FooterLink, value: string) {
    const links = [...(profile.footerLinks || [])];
    links[index] = { ...(links[index] || { label: '', url: '' }), [key]: value };
    setField('footerLinks', links);
  }

  function addFooterLink() {
    const links = profile.footerLinks || [];
    if (links.length >= maxFooterLinks) return;
    setField('footerLinks', [...links, { label: '', url: '#' }]);
  }

  function removeFooterLink(index: number) {
    setField('footerLinks', (profile.footerLinks || []).filter((_, itemIndex) => itemIndex !== index));
  }

  async function onSubmit(values: Partial<SiteProfile>) {
    setSaving(true);
    try {
      const footerLinks = (profile.footerLinks || []).slice(0, maxFooterLinks);
      const saved = await saveSiteProfile({
        ...profile,
        ...values,
        footerLinks,
        footerLinksJson: JSON.stringify(footerLinks)
      });
      setProfile(saved);
      form.setFieldsValue(saved);
      message.success('基础信息已保存');
    } catch (err) {
      message.error(err instanceof Error ? err.message : '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  const footerLinks = profile.footerLinks || [];

  return (
    <div>
      <PageHeader title="页脚" description="维护页脚中展示的公司信息、联系方式、友情链接和备案信息。" />
      {loading ? <Card><Typography.Text type="secondary">页脚信息加载中...</Typography.Text></Card> : (
        <Form form={form} layout="vertical" initialValues={emptyProfile} onFinish={onSubmit}>
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <SectionCardGroup mode="accordion" defaultExpandedIndex={0}>
                <SectionCard title="公司信息" description="这些内容会出现在网站顶部、页脚和联系区域。">
                  <Row gutter={16}>
                    <Col xs={24} md={12}><Form.Item name="companyName" label="公司名称" rules={[{ required: true, message: '请填写公司名称' }]}><Input placeholder="例如：王储润滑油" /></Form.Item></Col>
                    <Col xs={24} md={12}><Form.Item name="email" label="联系邮箱"><Input placeholder="例如：service@example.com" /></Form.Item></Col>
                  </Row>
                  <Form.Item name="address" label="公司地址"><Input placeholder="请输入公司地址" /></Form.Item>
                </SectionCard>
                <SectionCard title="联系方式" description="用于顶部电话、产品详情和咨询转化位置。">
                  <Row gutter={16}>
                    <Col xs={24} md={12}><Form.Item name="phone" label="网站顶部电话"><Input placeholder="例如：400-000-0000" /></Form.Item></Col>
                    <Col xs={24} md={12}><Form.Item name="hotline" label="客户咨询热线"><Input placeholder="例如：0571-00000000" /></Form.Item></Col>
                  </Row>
                </SectionCard>
                <SectionCard title="页脚信息" description="用于网站底部友情链接、版权和备案信息。">
                  <Form.Item name="footerText" label="页脚文案"><Input.TextArea rows={4} placeholder="请输入页脚展示文案" /></Form.Item>
                  <Form.Item name="footerLinkTitle" label="友情链接标题"><Input placeholder="例如：友情链接：" /></Form.Item>
                  <Card size="small" title="友情链接" extra={<Button type="primary" onClick={addFooterLink} disabled={footerLinks.length >= maxFooterLinks}>新增友情链接</Button>} style={{ marginBottom: 16 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {footerLinks.map((link, index) => (
                        <Space key={index} style={{ width: '100%' }} align="start">
                          <Typography.Text style={{ width: 32, lineHeight: '32px' }}>{index + 1}</Typography.Text>
                          <Input placeholder="链接名称" value={link.label || ''} onChange={(e) => setFooterLink(index, 'label', e.target.value)} />
                          <Input placeholder="链接地址" value={link.url || ''} onChange={(e) => setFooterLink(index, 'url', e.target.value)} />
                          <ConfirmButton danger title="确定删除这个友情链接吗？" onConfirm={() => removeFooterLink(index)}>删除</ConfirmButton>
                        </Space>
                      ))}
                      {footerLinks.length === 0 && <Typography.Text type="secondary">还没有友情链接，请点击“新增友情链接”。</Typography.Text>}
                    </Space>
                  </Card>
                  <Form.Item name="copyrightText" label="版权文本"><Input /></Form.Item>
                  <Row gutter={16}>
                    <Col xs={24} md={12}><Form.Item name="policeFilingText" label="公安备案文本"><Input /></Form.Item></Col>
                    <Col xs={24} md={12}><Form.Item name="policeFilingUrl" label="公安备案链接"><Input /></Form.Item></Col>
                    <Col xs={24} md={12}><Form.Item name="icpText" label="ICP备案文本"><Input /></Form.Item></Col>
                    <Col xs={24} md={12}><Form.Item name="icpUrl" label="ICP备案链接"><Input /></Form.Item></Col>
                  </Row>
                </SectionCard>
              </SectionCardGroup>
            </Col>
            <Col xs={24} xl={8}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Card title="顶部 Logo">
                  <Typography.Paragraph type="secondary">建议使用透明背景 PNG 或 WebP 图片，上传前裁剪为 142 × 62。</Typography.Paragraph>
                  <Dropzone value={profile.logoUrl} cropPreset="headerLogo" onChange={(url) => setField('logoUrl', url)} />
                </Card>
                <Card title="页脚 Logo">
                  <Typography.Paragraph type="secondary">建议使用透明背景 PNG 或 WebP 图片，上传前裁剪为 160 × 72。</Typography.Paragraph>
                  <Dropzone value={profile.footerLogoUrl} cropPreset="footerLogo" onChange={(url) => setField('footerLogoUrl', url)} />
                </Card>
                <Card title="页面预览">
                  <Typography.Title level={5}>{profile.companyName || '公司名称'}</Typography.Title>
                  <Typography.Paragraph type="secondary">{profile.address || '公司地址会显示在这里'}</Typography.Paragraph>
                  <Row gutter={[12, 12]}>
                    <Col span={24}><Typography.Text type="secondary">顶部电话</Typography.Text><br /><Typography.Text>{profile.phone || '未填写'}</Typography.Text></Col>
                    <Col span={24}><Typography.Text type="secondary">咨询热线</Typography.Text><br /><Typography.Text>{profile.hotline || '未填写'}</Typography.Text></Col>
                    <Col span={24}><Typography.Text type="secondary">邮箱</Typography.Text><br /><Typography.Text>{profile.email || '未填写'}</Typography.Text></Col>
                  </Row>
                </Card>
                <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button type="primary" htmlType="submit" loading={saving} block>{saving ? '保存中...' : '保存基础信息'}</Button>
                    <Typography.Text type="secondary">保存后，前台刷新即可看到最新基础资料。</Typography.Text>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
}
