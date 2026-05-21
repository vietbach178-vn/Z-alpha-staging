'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  titleVi: z.string().min(1),
  titleEn: z.string().optional(),
  excerptVi: z.string().optional(),
  excerptEn: z.string().optional(),
  categoryId: z.string().optional(),
  source: z.string().optional(),
  externalUrl: z.string().optional(),
  heroImage: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  bodyVi: z.any(),
  bodyEn: z.any().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
}

export async function saveNews(input: z.infer<typeof schema>) {
  await requireAdmin();
  const data = schema.parse(input);
  const slug = (data.slug && data.slug.trim()) || slugify(data.titleVi);

  const common = {
    slug,
    titleVi: data.titleVi,
    titleEn: data.titleEn || null,
    excerptVi: data.excerptVi || null,
    excerptEn: data.excerptEn || null,
    categoryId: data.categoryId || null,
    source: data.source || null,
    externalUrl: data.externalUrl || null,
    heroImage: data.heroImage || null,
    status: data.status,
    publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    bodyVi: data.bodyVi ?? [],
    bodyEn: data.bodyEn ?? null,
  };

  if (data.id) {
    await prisma.newsItem.update({ where: { id: data.id }, data: common });
  } else {
    await prisma.newsItem.create({ data: common });
  }

  revalidatePath('/admin/news');
  revalidatePath('/vi/news');
  revalidatePath('/en/news');
  revalidatePath(`/vi/news/${slug}`);
  revalidatePath(`/en/news/${slug}`);
}

export async function deleteNews(id: string) {
  await requireAdmin();
  await prisma.newsItem.delete({ where: { id } });
  revalidatePath('/admin/news');
  redirect('/admin/news');
}
