import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const legalStatementSections = [
  {
    heading: '我们的责任',
    paragraphs: [
      '本站内的信息、内容不是全面的。尽管我们非常努力，但他们可能不是精确的、及时更新的或适合于任何特殊情况。我们不承担因不精确确或遗漏而产生的责任，但欺骗性的错误表述除外。您根据本站内的信息而做出的决定应完全是您的责任。桔尔润（北京）润滑油有限公司以及其子公司不承担因登录本站、使用本站或使用本站内的信息而产生的任何直接和间接的损失或损害。当然，如果您发电子邮件至juerrun@163.com提出问题，我们非常高兴和您讨论。',
      '如果您提供的信息是有关个人方面的信息，我们将根据网站的《用户隐私声明》予以对待，否则，如果您提供信息给我们，视为同意我们对这些信息拥有无限的权利，我们可以选择任何方式使用这些信息。这些信息将不构成机密信息。'
    ]
  },
  {
    heading: '本网站的版权和商标所有权',
    paragraphs: [
      '除非另有规定，本站的全部内容和下载内容直接归所有我司或通过子公司间接归其所有。版权所有，违者必究。',
      '您有责任遵守所有可适用的版权法。我们允许您在浏览网页的过程中进行复制作为必要的附带行为；为个人合理使用之目的，您可以打印本站内容，但严禁用于其它方面。“kronprinsK”“kronprins”“王储”产品的品牌都是商标，归桔尔润（北京）润滑油有限公司所有。没有我们的明示许可，您不得抄袭本站，也不可将其连接到主页以外的其它网页。'
    ]
  },
  {
    heading: '链接使用',
    paragraphs: [
      '我们和我们的子公司不对其它网站的内容负责，包括友情链接网站的内容。我们对这些网站或链接不负任何相关责任。',
      '如果我们对第三方网站提供超级连接，那是因为我们诚实地相信该网站含有或可能含有与我们的网站内容相关的材料。这链接并不意味着桔尔润（北京）润滑油有限公司或其子公司已经检查过或赞成该第三方网站或其内容——实际上有时候超链接链接到的第三方网站所载的观点可能与桔尔润（北京）润滑油有限公司或其子公司网站的内容相矛盾。'
    ]
  },
  {
    heading: '本网站所适用的法律',
    paragraphs: [
      '您对本网站和其下载内容的使用及这些条件条款的作用均适用中国法律，对于因使用本网站引起的纠纷，管辖地法院应拥有排他性的管辖权。',
      '倘主管当局认为这些条件条款的任何条款或条款的任何部分在某一限度内无效、非法或不可实施，则该条款将在相应限度内终止效力，其余条款仍将在法律允许的最大限度内有效和实施。'
    ]
  },
  {
    heading: '版权所有 翻版必究',
    paragraphs: []
  }
];

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
        {
          title: '品牌定制',
          description: '提供成熟的品牌定制与产品包装方案，满足渠道客户展示和销售需求。',
          icon: '✥',
          linkUrl: '/features/brand-customization',
          sections: [
            {
              heading: '品牌定制',
              paragraphs: [
                '围绕客户品牌定位、渠道形象和产品系列规划，提供包装设计、标签规范、产品组合和展示资料等定制服务。',
                '通过成熟的产品体系和生产协同能力，帮助合作客户快速形成统一的品牌展示效果，满足终端销售和渠道推广需求。'
              ]
            }
          ]
        },
        {
          title: '附加服务',
          description: '从设计、打样到生产交付，提供稳定高效的一站式服务支持。',
          icon: '✥',
          linkUrl: '/features/additional-services',
          sections: [
            {
              heading: '附加服务',
              paragraphs: [
                '从前期沟通、产品建议、包装打样到生产交付，围绕客户合作流程提供配套服务支持。',
                '根据客户经营场景和市场需求，协助完善产品资料、展示内容和交付安排，提升合作效率。'
              ]
            }
          ]
        },
        {
          title: '天然保障',
          description: '严格检测流程和生产管理体系，保障产品品质稳定可靠。',
          icon: '✥',
          linkUrl: '/features/natural-assurance',
          sections: [
            {
              heading: '天然保障',
              paragraphs: [
                '依托规范化检测流程和生产管理体系，对原料、生产过程和成品质量进行持续管理。',
                '通过关键指标检测、过程记录和质量复核，保障产品在不同应用场景中的稳定性和可靠性。'
              ]
            }
          ]
        },
        {
          title: '工厂直供',
          description: '依托成熟供应链与生产体系，为客户提供高性价比合作方案。',
          icon: '✥',
          linkUrl: '/features/factory-direct',
          sections: [
            {
              heading: '工厂直供',
              paragraphs: [
                '依托成熟的供应链和生产组织能力，减少中间环节，为合作客户提供稳定的产品供应支持。',
                '结合订单需求、包装规格和交付节奏，提供更具效率的生产安排和合作方案。'
              ]
            }
          ]
        }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'supportModule',
    title: '生产设计与制作',
    subtitle: '桔尔润（北京）润滑油有限公司',
    data: {
      tabs: [
        {
          title: '调和',
          imageUrl: '',
          heading: '生产调和',
          description: '围绕不同油品应用场景，建立标准化调和流程，为客户提供稳定可靠的产品生产支持。',
          thumbnails: [],
          linkUrl: '/support/production-blending'
        },
        {
          title: '检测',
          imageUrl: '',
          heading: '锅炉百科',
          description: '围绕润滑油研发、生产检测与品质管理，建立标准化实验流程和技术服务体系。',
          thumbnails: [],
          linkUrl: '/support/lab-testing'
        },
        {
          title: '检验',
          imageUrl: '',
          heading: '品质检验',
          description: '通过规范化检测标准，对产品性能、稳定性和适用性进行持续检验。',
          thumbnails: [],
          linkUrl: '/support/quality-inspection'
        }
      ]
    }
  },
  {
    pageKey: 'support',
    sectionKey: 'supportPage',
    title: '技术支持',
    subtitle: '',
    data: {
      heroImageUrl: '',
      centers: [
        { title: '研发中心', description: '研发中心围绕润滑油产品应用场景，持续开展配方研究、性能验证和工艺优化，为客户提供从产品选型到技术应用的系统支持，帮助产品在不同设备和工况下保持稳定表现。' },
        { title: '质量中心', description: '质量中心建立覆盖原料、生产过程和成品交付的检测体系，通过标准化检验流程、数据记录和结果复核，持续保障产品质量稳定，为客户使用与售后服务提供可靠依据。' }
      ],
      technicalColumns: [
        { title: '辅料化验', description: '针对基础油、添加剂及相关辅料开展入厂化验，核对关键指标与适用范围，确保进入生产环节的原辅料满足配方和质量要求。' },
        { title: '结构解析', description: '结合产品性能目标与应用环境，分析配方结构、材料匹配和性能表现，为研发调整、产品升级和客户技术沟通提供依据。' },
        { title: '调和工艺', description: '根据不同产品类型制定调和温度、时间、顺序和过程控制要求，提升生产一致性，保障产品性能稳定释放并便于过程复核。' },
        { title: '标准制定', description: '围绕企业标准、检测规范和交付要求建立统一文件体系，使研发、生产、检测和售后环节具备清晰可执行的质量依据。' },
        { title: '产品封装', description: '对产品包装、标识、批次和入库流程进行规范管理，确保交付形象统一、信息准确，并便于后续追踪、复盘与服务。' },
        { title: '三方原则', description: '坚持客户需求、技术标准和质量验证三方协同，重要问题以数据和记录为依据，保证沟通透明、执行可追溯和复核。' }
      ],
      serviceStations: [
        { station: '华北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '北京、天津、河北、山西、内蒙古' },
        { station: '东北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '辽宁、吉林、黑龙江' },
        { station: '华东服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '上海、江苏、浙江、安徽、福建、江西、山东' },
        { station: '华中服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '河南、湖北、湖南' },
        { station: '华南服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '广东、广西、海南' },
        { station: '西南服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '重庆、四川、贵州、云南、西藏' },
        { station: '西北服务站', contact: '王皓', phone: '0519-88865190', address: '北京市大兴区科创五街38号院305', areas: '陕西、甘肃、青海、宁夏、新疆' }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'processModule',
    title: '先进的制作工艺',
    subtitle: '桔尔润（北京）润滑油有限公司',
    data: {
      items: [
        {
          title: '灌装线',
          description: '自动化灌装流程提升生产效率，保障产品包装规格统一、出厂品质稳定。',
          imageUrl: '',
          galleryImages: [],
          linkUrl: '/process/filling-line',
          sections: [{ paragraphs: ['自动化灌装流程提升生产效率，围绕灌装、封口、贴标和装箱等环节建立规范化作业流程，保障产品包装规格统一、出厂品质稳定。'] }]
        },
        {
          title: '设备管理',
          description: '规范化设备管理保障生产连续性与品质稳定。',
          imageUrl: '',
          galleryImages: [],
          linkUrl: '/process/equipment-management',
          sections: [{ paragraphs: ['通过规范化设备管理、日常维护和运行检查，保障生产设备保持稳定状态，为连续生产和品质控制提供可靠基础。'] }]
        },
        {
          title: '设备',
          description: '成熟设备体系满足多类油品生产需求。',
          imageUrl: '',
          galleryImages: [],
          linkUrl: '/process/equipment',
          sections: [{ paragraphs: ['成熟设备体系覆盖调和、灌装、检测和辅助生产环节，能够满足多类润滑油产品生产需求，并支持不同规格订单的稳定交付。'] }]
        },
        {
          title: '仓储',
          description: '规范仓储管理保障产品交付效率。',
          imageUrl: '',
          galleryImages: [],
          linkUrl: '/process/warehouse',
          sections: [{ paragraphs: ['规范仓储管理围绕产品入库、存放、出库和交付流程展开，保障产品存放安全、库存清晰和订单交付效率。'] }]
        }
      ]
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'aboutPreview',
    title: '关于我们',
    subtitle: '桔尔润（北京）润滑油有限公司',
    data: {
      imageUrl: '',
      body: '桔尔润（北京）润滑油有限公司专注润滑油产品研发、生产与渠道服务。公司围绕汽车润滑、工业润滑和特种油品场景，为客户提供稳定可靠的产品和合作支持。',
      linkUrl: '/about'
    }
  },
  {
    pageKey: 'home',
    sectionKey: 'certificatePreview',
    title: '荣誉资质',
    subtitle: '',
    data: { images: [] }
  },
  {
    pageKey: 'products',
    sectionKey: 'advantages',
    title: '加盟优势',
    subtitle: '桔尔润（北京）润滑油有限公司',
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
    subtitle: '桔尔润（北京）润滑油有限公司',
    data: {
      items: [
        { title: '专属经理对接', description: '为合作客户提供专人对接服务。', icon: '♙', linkUrl: '/benefits/dedicated-manager' },
        { title: '按需邮寄样品', description: '根据客户需求提供样品支持。', icon: '▣', linkUrl: '/benefits/sample-delivery' },
        { title: '免费设计培训', description: '提供产品展示和渠道运营支持。', icon: '✕', linkUrl: '/benefits/design-training' },
        { title: '免费设计培训', description: '提供产品展示和渠道运营支持。', icon: '✕', linkUrl: '/benefits/display-support' },
        { title: '共建实施方案', description: '结合客户市场制定合作方案。', icon: '▤', linkUrl: '/benefits/implementation-plan' },
        { title: '建立长效机制', description: '持续跟进合作效果和供应需求。', icon: '🔗', linkUrl: '/benefits/long-term-service' }
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
  },
  {
    pageKey: 'contact',
    sectionKey: 'contactInfo',
    title: '联系我们',
    subtitle: '',
    data: {
      body: '',
      mapImageUrl: '',
      items: [
        { label: '公司名称', value: '桔尔润（北京）润滑油有限公司' },
        { label: '公司地址', value: '北京市大兴区科创五街38号院' },
        { label: '联系电话', value: '0519-68288220' },
        { label: '服务热线', value: '0519-68288220' },
        { label: '电子邮箱', value: 'service@example.com' }
      ]
    }
  },
  {
    pageKey: 'legal',
    sectionKey: 'legalStatement',
    title: '法律声明',
    subtitle: '',
    data: {
      sections: legalStatementSections
    }
  },
  {
    pageKey: 'supportDetails',
    sectionKey: 'productionBlending',
    title: '生产调和',
    subtitle: '',
    data: {
      sections: [
        {
          heading: '生产调和',
          paragraphs: [
            '围绕不同油品应用场景，建立标准化调和流程，对基础油、添加剂和调和工艺进行规范管理，保障产品性能稳定。',
            '生产过程按照配方、温度、时间和检验节点执行，配合过程记录和质量复核，为客户提供可靠的产品生产支持。'
          ]
        }
      ]
    }
  },
  {
    pageKey: 'supportDetails',
    sectionKey: 'labTesting',
    title: '锅炉百科',
    subtitle: '',
    data: {
      sections: [
        {
          heading: '检测体系',
          paragraphs: [
            '围绕润滑油研发、生产检测与品质管理，建立标准化实验流程和技术服务体系，覆盖原料、半成品和成品检测环节。',
            '通过关键指标检测和数据记录，持续跟踪产品稳定性与适用性，为生产调整和客户应用提供依据。'
          ]
        }
      ]
    }
  },
  {
    pageKey: 'supportDetails',
    sectionKey: 'qualityInspection',
    title: '品质检验',
    subtitle: '',
    data: {
      sections: [
        {
          heading: '品质检验',
          paragraphs: [
            '通过规范化检测标准，对产品性能、稳定性和适用性进行持续检验，确保不同批次产品保持一致品质。',
            '检验流程覆盖入库、生产、出厂等关键节点，并结合留样和记录管理，为产品交付提供质量保障。'
          ]
        }
      ]
    }
  }
];

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123456';

  const adminUser = await prisma.adminUser.findUnique({ where: { username } });
  if (!adminUser) {
    await prisma.adminUser.create({
      data: {
        username,
        passwordHash: await hashPassword(password),
        role: 'admin'
      }
    });
  }

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
      { label: '链接名称', url: '#' }
    ]),
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
    seoDescription: '桔尔润（北京）润滑油有限公司官方网站'
  };

  const siteProfile = await prisma.siteProfile.findFirst();
  if (!siteProfile) {
    await prisma.siteProfile.create({ data: footerDefaults });
  }

  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {
    await prisma.navigationItem.createMany({
      data: [
        { label: '首页', url: '/', sortOrder: 1 },
        { label: '产品中心', url: '/products', sortOrder: 2 },
        { label: '技术支持', url: '/support', sortOrder: 3 },
        { label: '渠道合作', url: '/consult', sortOrder: 4 },
        { label: '关于我们', url: '/about', sortOrder: 5 }
      ]
    });
  }

  for (const category of categories) {
    const existingCategory = await prisma.productCategory.findUnique({ where: { slug: category.slug } });
    if (!existingCategory) {
      await prisma.productCategory.create({ data: category });
    }
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
    const existingProduct = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (!existingProduct) {
      await prisma.product.create({ data: product });
    }
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
    const existingSection = await prisma.contentSection.findUnique({
      where: { pageKey_sectionKey: { pageKey: section.pageKey, sectionKey: section.sectionKey } }
    });
    if (!existingSection) {
      await prisma.contentSection.create({
        data: {
          pageKey: section.pageKey,
          sectionKey: section.sectionKey,
          title: section.title,
          subtitle: section.subtitle || '',
          dataJson: JSON.stringify(section.data)
        }
      });
    }
  }

  const legacyName = '稼尔润（北京）润滑油有限公司';
  const correctName = '桔尔润（北京）润滑油有限公司';
  const sectionsWithLegacyName = await prisma.contentSection.findMany({ where: { subtitle: legacyName } });
  for (const section of sectionsWithLegacyName) {
    await prisma.contentSection.update({ where: { id: section.id }, data: { subtitle: correctName } });
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
