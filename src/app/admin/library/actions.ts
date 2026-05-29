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
  titleVi: z.string().min(1, 'Tiêu đề VI bắt buộc'),
  titleEn: z.string().optional(),
  descriptionVi: z.string().optional(),
  descriptionEn: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  fileUrl: z.string().min(1, 'File bắt buộc'),
  fileName: z.string().min(1, 'File name bắt buộc'),
  fileSize: z.number().int().nonnegative().optional(),
  fileMime: z.string().optional(),
  category: z.enum(['BOOK', 'REPORT', 'REFERENCE']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  order: z.number().int().optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return session;
}

export type ActionResult = { ok: true; id: string } | { ok: false; error: string; field?: string };

export async function saveLibrary(input: z.infer<typeof schema>): Promise<ActionResult> {
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
    descriptionVi: data.descriptionVi || null,
    descriptionEn: data.descriptionEn || null,
    thumbnailUrl: data.thumbnailUrl || null,
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    fileSize: data.fileSize ?? null,
    fileMime: data.fileMime ?? null,
    category: data.category,
    status: data.status,
    publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    order: data.order ?? 0,
  };

  let saved: { id: string };
  try {
    if (data.id) {
      saved = await prisma.libraryItem.update({ where: { id: data.id }, data: common, select: { id: true } });
    } else {
      saved = await prisma.libraryItem.create({ data: common, select: { id: true } });
    }
  } catch (e: unknown) {
    if (typeof e === 'object' && e && 'code' in e && (e as { code: string }).code === 'P2002') {
      return { ok: false, error: 'Slug đã tồn tại — đổi slug khác hoặc đổi tiêu đề.', field: 'slug' };
    }
    throw e;
  }

  revalidatePath('/admin/library');
  revalidatePath('/vi/library');
  revalidatePath('/en/library');
  return { ok: true, id: saved.id };
}

export async function deleteLibrary(id: string) {
  await requireAdmin();
  await prisma.libraryItem.delete({ where: { id } });
  revalidatePath('/admin/library');
  redirect('/admin/library');
}
