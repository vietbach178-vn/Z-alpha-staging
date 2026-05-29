'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return session;
}

const createSchema = z.object({
  articleId: z.string().min(1),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().nonnegative().optional(),
  fileMime: z.string().optional(),
  language: z.enum(['VI', 'EN', 'OTHER']).default('VI'),
  labelVi: z.string().optional(),
  labelEn: z.string().optional(),
});

const updateSchema = z.object({
  id: z.string().min(1),
  language: z.enum(['VI', 'EN', 'OTHER']).optional(),
  labelVi: z.string().optional(),
  labelEn: z.string().optional(),
  order: z.number().int().optional(),
});

export type AttachmentActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createAttachment(input: z.infer<typeof createSchema>): Promise<AttachmentActionResult> {
  await requireAdmin();
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const count = await prisma.researchAttachment.count({ where: { articleId: data.articleId } });
  await prisma.researchAttachment.create({
    data: {
      articleId: data.articleId,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize ?? null,
      fileMime: data.fileMime ?? null,
      language: data.language,
      labelVi: data.labelVi || null,
      labelEn: data.labelEn || null,
      order: count,
    },
  });
  revalidatePath(`/admin/research/${data.articleId}`);
  return { ok: true };
}

export async function updateAttachment(input: z.infer<typeof updateSchema>): Promise<AttachmentActionResult> {
  await requireAdmin();
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const row = await prisma.researchAttachment.update({
    where: { id: data.id },
    data: {
      language: data.language ?? undefined,
      labelVi: data.labelVi !== undefined ? (data.labelVi || null) : undefined,
      labelEn: data.labelEn !== undefined ? (data.labelEn || null) : undefined,
      order: data.order ?? undefined,
    },
  });
  revalidatePath(`/admin/research/${row.articleId}`);
  return { ok: true };
}

export async function deleteAttachment(id: string): Promise<AttachmentActionResult> {
  await requireAdmin();
  const row = await prisma.researchAttachment.delete({ where: { id } });
  revalidatePath(`/admin/research/${row.articleId}`);
  return { ok: true };
}
