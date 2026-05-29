'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  return session;
}

const STATUSES = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const;
type Status = (typeof STATUSES)[number];

export async function updateContactStatus(id: string, status: Status) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return { ok: false as const, error: 'invalid status' };
  await prisma.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath('/admin/contacts');
  revalidatePath(`/admin/contacts/${id}`);
  return { ok: true as const };
}

export async function deleteContact(id: string) {
  await requireAdmin();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/admin/contacts');
  redirect('/admin/contacts');
}
