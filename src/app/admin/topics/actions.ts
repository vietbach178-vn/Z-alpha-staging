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

const TONES = ['teal', 'blue', 'orange', 'red', 'purple'] as const;

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  labelVi: z.string().min(1, 'Tên VI bắt buộc'),
  labelEn: z.string().optional(),
  tone: z.enum(TONES),
  order: z.number().int().optional(),
});

export type ActionResult = { ok: true } | { ok: false; error: string; field?: string };

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
}

export async function saveTopic(input: z.infer<typeof schema>): Promise<ActionResult> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? '') };
  }
  const data = parsed.data;
  const slug = (data.slug && data.slug.trim()) || slugify(data.labelVi);

  const common = {
    slug,
    labelVi: data.labelVi,
    labelEn: data.labelEn || null,
    tone: data.tone,
    order: data.order ?? 0,
  };

  try {
    if (data.id) await prisma.topic.update({ where: { id: data.id }, data: common });
    else         await prisma.topic.create({ data: common });
  } catch (e: unknown) {
    if (typeof e === 'object' && e && 'code' in e && (e as { code: string }).code === 'P2002') {
      return { ok: false, error: 'Slug đã tồn tại — đổi slug khác.', field: 'slug' };
    }
    throw e;
  }

  revalidatePath('/admin/topics');
  revalidatePath('/vi/research');
  revalidatePath('/en/research');
  return { ok: true };
}

export async function deleteTopic(id: string): Promise<ActionResult> {
  await requireAdmin();
  const count = await prisma.researchArticle.count({ where: { topicId: id } });
  if (count > 0) {
    return { ok: false, error: `Còn ${count} bài đang dùng chủ đề này. Đổi chủ đề các bài đó trước khi xóa.` };
  }
  await prisma.topic.delete({ where: { id } });
  revalidatePath('/admin/topics');
  return { ok: true };
}
