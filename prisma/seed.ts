/**
 * Seed initial topics, news categories, and admin user.
 * Run: npx tsx prisma/seed.ts (or via `npm run db:seed`).
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const TOPICS = [
  { slug: 'mang-xa-hoi',         labelVi: 'Mạng xã hội & hành vi',           labelEn: 'Social media & behaviour',        tone: 'teal',   order: 1 },
  { slug: 'suc-khoe-tinh-than',  labelVi: 'Sức khoẻ tinh thần',              labelEn: 'Mental health',                   tone: 'red',    order: 2 },
  { slug: 'giao-duc-so',         labelVi: 'Giáo dục số',                     labelEn: 'Digital education',               tone: 'blue',   order: 3 },
  { slug: 'chinh-sach',          labelVi: 'Chính sách & quyền trẻ em',       labelEn: 'Policy & children\'s rights',     tone: 'orange', order: 4 },
  { slug: 'cong-nghe-moi',       labelVi: 'Công nghệ mới (AI, AR…)',         labelEn: 'Emerging tech (AI, AR…)',         tone: 'purple', order: 5 },
];

const NEWS_CATEGORIES = [
  { slug: 'announcement', labelVi: 'Thông báo',         labelEn: 'Announcements',  tone: 'blue',   order: 1 },
  { slug: 'press',        labelVi: 'Thông cáo báo chí', labelEn: 'Press releases', tone: 'orange', order: 2 },
  { slug: 'event',        labelVi: 'Sự kiện',           labelEn: 'Events',         tone: 'teal',   order: 3 },
  { slug: 'article',      labelVi: 'Bài viết',          labelEn: 'Articles',       tone: 'purple', order: 4 },
];

async function main() {
  console.log('Seeding…');

  // 1. Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@z-alpha.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme-dev';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // 2. Topics
  for (const t of TOPICS) {
    await prisma.topic.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  console.log(`✓ Topics: ${TOPICS.length}`);

  // 3. News categories
  for (const c of NEWS_CATEGORIES) {
    await prisma.newsCategory.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  console.log(`✓ News categories: ${NEWS_CATEGORIES.length}`);

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
