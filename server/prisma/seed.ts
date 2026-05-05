import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

const categories = [
  { name: '汽油机油', slug: 'gasoline-oil', sortOrder: 1 },
  { name: '柴油机油', slug: 'diesel-oil', sortOrder: 2 },
  { name: '工业油品', slug: 'industrial-oil', sortOrder: 3 },
  { name: '导热油', slug: 'thermal-oil', sortOrder: 4 },
  { name: '润滑油', slug: 'lubricating-oil', sortOrder: 5 },
  { name: '特种油品研发', slug: 'special-oil', sortOrder: 6 }
];

const contentSections = [
  {
    pageKey: 'home',
    sectionKey: 'featureCards',
    title: '服务优势',
    data: {
      items: [
        { title: '品牌定制', description: '提供成熟的品牌定制与产品包装方案，满足渠道客户展示和销售需求。', icon: '✥', linkUrl: '/consult' },
        { title: '附加服务', description: '从设计、打样到生产交付，提供稳定高效的一站式服务支持。', icon: '✥', linkUrl: '/consult' },
        { title: '天然保障', description: '严格检测流程和生产管理体系，保障产品品质稳定可靠。', icon: '✥', linkUrl: '/certificates' },
        { title: '工厂直供', description: '依托成熟供应链与生产体系，为客户提供高性价比合作方案。', icon: '✥', linkUrl: '/products' }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'supportModule',
    title: '生产设计与制作',
    subtitle: '稼尔润（北京）润滑油有限公司',
    data: {
      tabs: [
        {
          title: '调和',
          imageUrl: '',
          heading: '生产调和',
          description: '围绕不同油品应用场景，建立标准化调和流程，为客户提供稳定可靠的产品生产支持。',
          thumbnails: []
        },
        {
          title: '检测',
          imageUrl: '',
          heading: '锅炉百科',
          description: '围绕润滑油研发、生产检测与品质管理，建立标准化实验流程和技术服务体系。',
          thumbnails: []
        },
        {
          title: '检验',
          imageUrl: '',
          heading: '品质检验',
          description: '通过规范化检测标准，对产品性能、稳定性和适用性进行持续检验。',
          thumbnails: []
        }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'processModule',
    title: '先进的制作工艺',
    subtitle: '稼尔润（北京）润滑油有限公司',
    data: {
      items: [
        { title: '巡检工艺', description: '标准化巡检流程保障生产连续性与品质稳定。', imageUrl: '' },
        { title: '资料', description: '完善资料体系支撑产品研发、检测和交付。', imageUrl: '' },
        { title: '设备', description: '成熟设备体系满足多类油品生产需求。', imageUrl: '' },
        { title: '仓储', description: '规范仓储管理保障产品交付效率。', imageUrl: '' }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'aboutPreview',
    title: '关于我们',
    subtitle: '稼尔润（北京）润滑油有限公司',
    data: {
      imageUrl: '',
      body: '稼尔润（北京）润滑油有限公司专注润滑油产品研发、生产与渠道服务。公司围绕汽车润滑、工业润滑和特种油品场景，为客户提供稳定可靠的产品和合作支持。',
      linkUrl: '/#about'
    }
  },
  {
    pageKey: 'products',
    sectionKey: 'advantages',
    title: '加盟优势',
    subtitle: '稼尔润（北京）润滑油有限公司',
    data: {
      items: [
        { title: '产品优势', description: '成熟产品体系覆盖多类应用场景。', icon: '👍' },
        { title: '价格优势', description: '源头供应和高效管理带来合作空间。', icon: '🏷' },
        { title: '品质保障', description: '标准检测流程保障产品稳定可靠。', icon: '🛡' },
        { title: '技术优势', description: '技术团队提供产品设计与应用支持。', icon: '◆' }
      ]
    }
  },
  {
    pageKey: 'products',
    sectionKey: 'benefits',
    title: '加盟福利',
    subtitle: '稼尔润（北京）润滑油有限公司',
    data: {
      items: [
        { title: '专属经理对接', description: '为合作客户提供专人对接服务。', icon: '♙' },
        { title: '按需邮寄样品', description: '根据客户需求提供样品支持。', icon: '▣' },
        { title: '免费设计培训', description: '提供产品展示和渠道运营支持。', icon: '✕' },
        { title: '共建实施方案', description: '结合客户市场制定合作方案。', icon: '▤' },
        { title: '建立长效机制', description: '持续跟进合作效果和供应需求。', icon: '🔗' }
      ]
    }
  },
  {
    pageKey: 'consult',
    sectionKey: 'contactPanel',
    title: '还有更多疑问？',
    data: {
      consultantName: '王作高',
      consultantTitle: '总工程师',
      description: '这里是学历和工作经验，这里是工作经验和工作经验。',
      buttonText: '在线咨询',
      industryOptions: ['汽车后市场', '工业设备', '渠道代理', '其他']
    }
  }
];

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';

  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: {
      username,
      passwordHash: await hashPassword(password),
      role: 'admin'
    }
  });

  const footerDefaults = {
    companyName: '桔尔润（北京）润滑油有限公司',
    phone: '0519-68288220',
    hotline: '0519-68288220',
    address: '北京市大兴区科创五街38号院',
    footerText: '专注润滑油产品研发、生产与渠道服务',
    footerLinksJson: JSON.stringify([
      { label: '链接名称', url: '#' },
      { label: '链接名称', url: '#' },
      { label: '链接名称', url: '#' },
      { label: '链接名称', url: '#' },
      { label: '链接名称', url: '#' },
      { label: '链接名称', url: '#' }
    ]),
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
    seoTitle: '王储润滑油官网',
    seoDescription: '桔尔润（北京）润滑油有限公司官方网站'
  };

  const siteProfile = await prisma.siteProfile.findFirst();
  if (siteProfile) {
    await prisma.siteProfile.update({ where: { id: siteProfile.id }, data: footerDefaults });
  } else {
    await prisma.siteProfile.create({ data: footerDefaults });
  }

  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {
    await prisma.navigationItem.createMany({
      data: [
        { label: '首页', url: '/', sortOrder: 1 },
        { label: '产品中心', url: '/products', sortOrder: 2 },
        { label: '技术支持', url: '/#support', sortOrder: 3 },
        { label: '渠道合作', url: '/consult', sortOrder: 4 },
        { label: '关于我们', url: '/#about', sortOrder: 5 }
      ]
    });
  }

  for (const category of categories) {
    await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder },
      create: category
    });
  }

  const categoryRows = await prisma.productCategory.findMany();
  const categoryByName = new Map(categoryRows.map((category) => [category.name, category]));

  const products = [
    {
      name: '全合成S88 0W-40',
      slug: 's88-0w-40',
      categoryName: '汽油机油',
      categoryId: categoryByName.get('汽油机油')?.id,
      topSubtitle: '高性能全合成汽油机油',
      detailTitle: 'OMAJIC-UV2030',
      detailDescription: '适用于多种汽油发动机，提供稳定润滑表现。',
      productSpecsImageUrl: '',
      detailGalleryJson: JSON.stringify([{ imageUrl: '', caption: '细节' }, { imageUrl: '', caption: '细节' }]),
      performanceTitle: '稳定的生产表现',
      performanceText: '稳定油膜保护，适配多种驾驶场景。',
      performanceItemsJson: JSON.stringify([{ icon: '⚙', title: '稳定润滑', description: '持续提供稳定油膜保护。' }, { icon: '▣', title: '品质检测', description: '严格检测后出厂。' }, { icon: '●', title: '应用支持', description: '覆盖多种使用场景。' }, { icon: '▰', title: '快速交付', description: '成熟供应链保障交付。' }]),
      sortOrder: 1
    },
    {
      name: '半合成S86',
      slug: 's86',
      categoryName: '柴油机油',
      categoryId: categoryByName.get('柴油机油')?.id,
      topSubtitle: '兼顾保护与经济性的半合成机油',
      detailTitle: '半合成S86',
      detailDescription: '满足日常车辆润滑保护需求。',
      sortOrder: 2
    },
    {
      name: 'API CI-4',
      slug: 'api-ci-4',
      categoryName: '工业油品',
      categoryId: categoryByName.get('工业油品')?.id,
      topSubtitle: '工业与商用设备润滑产品',
      detailTitle: 'API CI-4',
      detailDescription: '适用于重载工况和工业设备维护。',
      sortOrder: 3
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  const bannerCount = await prisma.carouselBanner.count();
  if (bannerCount === 0) {
    await prisma.carouselBanner.create({
      data: {
        title: '极摩动力 超凡表现',
        subtitle: '专注润滑油产品与技术服务',
        imageUrl: '',
        linkUrl: '/products',
        sortOrder: 1
      }
    });
  }

  for (const section of contentSections) {
    await prisma.contentSection.upsert({
      where: { pageKey_sectionKey: { pageKey: section.pageKey, sectionKey: section.sectionKey } },
      update: {},
      create: {
        pageKey: section.pageKey,
        sectionKey: section.sectionKey,
        title: section.title,
        subtitle: section.subtitle || '',
        dataJson: JSON.stringify(section.data)
      }
    });
  }

  const certificateCount = await prisma.certificate.count();
  if (certificateCount === 0) {
    await prisma.certificate.createMany({
      data: [
        { title: '营业执照', category: '企业资质', imageUrl: '', sortOrder: 1 },
        { title: '信用证书', category: '企业资质', imageUrl: '', sortOrder: 2 },
        { title: '认证证书', category: '产品资质', imageUrl: '', sortOrder: 3 }
      ]
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
