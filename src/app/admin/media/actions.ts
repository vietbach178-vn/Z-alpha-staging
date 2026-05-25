'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deleteAsset as blobDelete } from '@/lib/storage';

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  await requireAdmin();
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return { ok: false, error: 'Không tìm thấy file.' };

  try {
    await blobDelete(asset.url);
  } catch (e: unknown) {
    // If blob already gone (404), still proceed to remove DB row.
    console.warn('Blob delete failed for', asset.url, e);
  }

  await prisma.asset.delete({ where: { id } });
  revalidatePath('/admin/media');
  return { ok: true };
}
