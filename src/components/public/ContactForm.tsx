'use client';

import { useState, useTransition } from 'react';
import type { Lang } from '@/lib/i18n';
import { submitContact } from '@/app/[lang]/contact/actions';

type Audience = 'STUDENT' | 'SCHOOL' | 'GOVERNMENT' | 'OTHER';

const AUDIENCE_LABELS: Record<Audience, { vi: string; en: string }> = {
  STUDENT:    { vi: 'Học sinh, sinh viên',                       en: 'Student' },
  SCHOOL:     { vi: 'Nhà trường / cơ sở giáo dục',                en: 'School / education institution' },
  GOVERNMENT: { vi: 'Chính phủ / nhà hoạch định chính sách',      en: 'Government / policy maker' },
  OTHER:      { vi: 'Khác',                                       en: 'Other' },
};

export default function ContactForm({ lang }: { lang: Lang }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [audience, setAudience] = useState<Audience | ''>('');
  const [message, setMessage] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!audience) {
      setFeedback({
        kind: 'error',
        text: lang === 'vi' ? 'Vui lòng chọn "Bạn là".' : 'Please select your role.',
      });
      return;
    }
    startTransition(async () => {
      const res = await submitContact({ fullName, email, audience, message, isUrgent: urgent, website });
      if (res.ok) {
        setFeedback({
          kind: 'ok',
          text: lang === 'vi'
            ? 'Đã gửi! Chúng tôi sẽ phản hồi qua email sớm nhất có thể.'
            : 'Sent! We will reply by email as soon as possible.',
        });
        setFullName(''); setEmail(''); setAudience(''); setMessage(''); setUrgent(false);
      } else {
        setFeedback({
          kind: 'error',
          text: res.error || (lang === 'vi' ? 'Có lỗi xảy ra, vui lòng thử lại.' : 'Something went wrong, please try again.'),
        });
      }
    });
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} aria-busy={pending}>
      <h2 className="contact-form__title">{lang === 'vi' ? 'Gửi tin nhắn' : 'Send a message'}</h2>

      {feedback && (
        <div
          className={`contact-form__feedback contact-form__feedback--${feedback.kind}`}
          role={feedback.kind === 'error' ? 'alert' : 'status'}
        >
          {feedback.text}
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cf-name">
            {lang === 'vi' ? 'Họ và tên' : 'Full name'} <span className="required">*</span>
          </label>
          <input
            id="cf-name" type="text" required
            placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'Your full name'}
            value={fullName} onChange={(e) => setFullName(e.target.value)}
            disabled={pending}
            minLength={2}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cf-audience">
            {lang === 'vi' ? 'Bạn là' : 'You are'} <span className="required">*</span>
          </label>
          <select
            id="cf-audience" required
            value={audience} onChange={(e) => setAudience(e.target.value as Audience | '')}
            disabled={pending}
          >
            <option value="" disabled>{lang === 'vi' ? '— Chọn đối tượng —' : '— Select —'}</option>
            {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((key) => (
              <option key={key} value={key}>{AUDIENCE_LABELS[key][lang]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="cf-email">Email <span className="required">*</span></label>
        <input
          id="cf-email" type="email" required placeholder="ban@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          disabled={pending}
        />
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">
          {lang === 'vi' ? 'Tin nhắn' : 'Message'} <span className="required">*</span>
        </label>
        <textarea
          id="cf-message" rows={6} required
          placeholder={lang === 'vi' ? 'Nội dung bạn muốn gửi…' : 'What would you like to say…'}
          value={message} onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
          minLength={10}
        />
      </div>

      <label className="form-checkbox">
        <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} disabled={pending} />
        <span>
          {lang === 'vi' ? 'Đây có phải là vấn đề khẩn cấp hoặc yêu cầu từ truyền thông?' : 'Is this an urgent matter or a media request?'}
        </span>
      </label>

      {/* Honeypot — hidden from sighted users + screen readers, bots fill it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          Website
          <input
            type="text" tabIndex={-1} autoComplete="off"
            value={website} onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary btn-lg" disabled={pending}>
        {pending
          ? (lang === 'vi' ? 'Đang gửi…' : 'Sending…')
          : (lang === 'vi' ? 'Gửi tin nhắn' : 'Send')}
        <i data-lucide="send" className="icon-sm" />
      </button>
    </form>
  );
}
