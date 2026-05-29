'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendEmail, contactNotifyHtml } from '@/lib/email';

const schema = z.object({
  fullName: z.string().min(2, 'Họ và tên bắt buộc').max(120),
  email: z.string().email('Email không hợp lệ'),
  audience: z.enum(['STUDENT', 'SCHOOL', 'GOVERNMENT', 'OTHER']),
  message: z.string().min(10, 'Tin nhắn quá ngắn').max(5000, 'Tin nhắn quá dài'),
  isUrgent: z.boolean().default(false),
  // Honeypot — must be empty (bots fill it)
  website: z.string().max(0).optional(),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; field?: string };

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: issue.message, field: String(issue.path[0] ?? '') };
  }
  const data = parsed.data;
  if (data.website && data.website.length > 0) {
    // Honeypot tripped — pretend success to avoid leaking detection
    return { ok: true };
  }

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null;
  const ua = h.get('user-agent');

  const row = await prisma.contactSubmission.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      audience: data.audience,
      message: data.message,
      isUrgent: data.isUrgent,
      ipAddress: ip,
      userAgent: ua,
    },
  });

  // Notify admin (best-effort, don't fail submission if email service unavailable)
  const notify = process.env.CONTACT_NOTIFY_EMAIL;
  if (notify) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await sendEmail({
      to: notify,
      subject: `[Z&Alpha] ${data.isUrgent ? '🚨 KHẨN — ' : ''}Tin nhắn mới từ ${data.fullName}`,
      html: contactNotifyHtml({
        fullName: data.fullName,
        email: data.email,
        audience: data.audience,
        message: data.message,
        isUrgent: data.isUrgent,
        createdAt: row.createdAt,
        adminUrl: `${base}/admin/contacts/${row.id}`,
      }),
      replyTo: data.email,
    });
  }

  return { ok: true };
}
