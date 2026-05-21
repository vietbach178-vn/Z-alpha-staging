'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip Vietnamese tones
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  titleVi: z.string().min(1, 'Tiêu đề VI bắt buộc'),
  titleEn: z.string().optional(),
  excerptVi: z.string().optional(),
  excerptEn: z.string().optional(),
  topicId: z.string().optional(),
  typeVi: z.string().optional(),
  typeEn: z.string().optional(),
  readingTime: z.number().optional(),
  heroImage: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  bodyVi: z.any(),
  bodyEn: z.any().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return session;
}

export type ActionResult = { ok: true } | { ok: false; error: string; field?: string };

export async function saveResearch(input: z.infer<typeof schema>): Promise<ActionResult> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? '') };
  }
  const data = parsed.data;

  const slug = (data.slug && data.slug.trim()) || slugify(data.titleVi);

  const common = {
    slug,
    titleVi: data.titleVi,
    titleEn: data.titleEn || null,
    excerptVi: data.excerptVi || null,
    excerptEn: data.excerptEn || null,
    topicId: data.topicId || null,
    typeVi: data.typeVi || null,
    typeEn: data.typeEn || null,
    readingTime: data.readingTime ?? null,
    heroImage: data.heroImage || null,
    featured: !!data.featured,
    status: data.status,
    publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    bodyVi: data.bodyVi ?? [],
    bodyEn: data.bodyEn ?? null,
  };

  try {
    if (data.id) {
      await prisma.researchArticle.update({ where: { id: data.id }, data: common });
    } else {
      await prisma.researchArticle.create({ data: common });
    }
  } catch (e: unknown) {
    if (typeof e === 'object' && e && 'code' in e && (e as { code: string }).code === 'P2002') {
      return { ok: false, error: 'Slug đã tồn tại — đổi slug khác hoặc đổi tiêu đề.', field: 'slug' };
    }
    throw e;
  }

  revalidatePath('/admin/research');
  revalidatePath('/vi/research');
  revalidatePath('/en/research');
  revalidatePath(`/vi/research/${slug}`);
  revalidatePath(`/en/research/${slug}`);
  return { ok: true };
}

export async function deleteResearch(id: string) {
  await requireAdmin();
  await prisma.researchArticle.delete({ where: { id } });
  revalidatePath('/admin/research');
  redirect('/admin/research');
}
