/**
 * Thin email sender. Resend if RESEND_API_KEY is set, else logs to stdout (dev fallback).
 * We don't pull the resend SDK to keep dependencies lean — the REST API is simple enough.
 */
import 'server-only';

interface SendEmailInput {
  to: string;
  from?: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = input.from || process.env.CONTACT_FROM_EMAIL || 'Z & Alpha <noreply@z-alpha.org>';

  if (!apiKey) {
    // Dev fallback — no key configured
    console.log('[email][dev fallback] would send to', input.to, '\n  subject:', input.subject);
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[email] Resend error:', res.status, text);
      return { ok: false, error: `Resend ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error('[email] Send failed:', err);
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' };
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const AUDIENCE_LABEL: Record<string, string> = {
  STUDENT: 'Học sinh, sinh viên',
  SCHOOL: 'Nhà trường / cơ sở giáo dục',
  GOVERNMENT: 'Chính phủ / nhà hoạch định chính sách',
  OTHER: 'Khác',
};

export function contactNotifyHtml(input: {
  fullName: string; email: string; audience: string;
  message: string; isUrgent: boolean; createdAt: Date; adminUrl?: string;
}): string {
  return `
<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;background:#f3f4f6;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    <div style="padding:20px 24px;background:${input.isUrgent ? '#fef2f2' : '#f0fdfa'};border-bottom:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:${input.isUrgent ? '#b91c1c' : '#0f766e'};">
        ${input.isUrgent ? '🚨 Tin nhắn KHẨN' : '📩 Tin nhắn mới'} — Z & Alpha
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#475569;">
        ${esc(input.createdAt.toLocaleString('vi-VN'))}
      </p>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600;">Từ</p>
      <p style="margin:0 0 4px;font-size:15px;color:#0f172a;font-weight:600;">${esc(input.fullName)}</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569;">
        <a href="mailto:${esc(input.email)}" style="color:#1d4ed8;text-decoration:none;">${esc(input.email)}</a>
        · ${esc(AUDIENCE_LABEL[input.audience] ?? input.audience)}
      </p>

      <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600;">Nội dung</p>
      <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;font-size:14.5px;line-height:1.6;color:#0f172a;white-space:pre-wrap;">${esc(input.message)}</div>

      ${input.adminUrl ? `<p style="margin:20px 0 0;"><a href="${input.adminUrl}" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;font-size:14px;">Mở trong admin</a></p>` : ''}
    </div>
  </div>
</body></html>`;
}
