import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';
const prisma = new PrismaClient();
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
    const productCount = await prisma.product.count();
    if (productCount === 0) {
        await prisma.product.createMany({
            data: [
                { name: '全合成S88 0W-40', slug: 's88-0w-40', category: '汽油机油', summary: '高性能全合成汽油机油', description: '适用于多种汽油发动机，提供稳定润滑表现。', sortOrder: 1 },
                { name: '半合成S86', slug: 's86', category: '柴油机油', summary: '兼顾保护与经济性的半合成机油', description: '满足日常车辆润滑保护需求。', sortOrder: 2 },
                { name: 'API CI-4', slug: 'api-ci-4', category: '工业油品', summary: '工业与商用设备润滑产品', description: '适用于重载工况和工业设备维护。', sortOrder: 3 }
            ]
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
}
main()
    .finally(async () => {
    await prisma.$disconnect();
});
