'use client';

import { useState } from 'react';
import type { Lang } from '@/lib/i18n';

export default function ContactForm({ lang }: { lang: Lang }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [urgent, setUrgent] = useState(false);

  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: wire to backend (server action) when admin/auth is ready
      }}
    >
      <h2 className="contact-form__title">{lang === 'vi' ? 'Gửi tin nhắn' : 'Send a message'}</h2>

      <div className="form-field">
        <label htmlFor="cf-email">Email <span className="required">*</span></label>
        <input id="cf-email" type="email" required placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="form-field">
        <label htmlFor="cf-message">
          {lang === 'vi' ? 'Tin nhắn' : 'Message'} <span className="required">*</span>
        </label>
        <textarea
          id="cf-message"
          rows={6}
          required
          placeholder={lang === 'vi' ? 'Nội dung bạn muốn gửi…' : 'What would you like to say…'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <label className="form-checkbox">
        <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
        <span>
          {lang === 'vi' ? 'Đây có phải là vấn đề khẩn cấp hoặc yêu cầu từ truyền thông?' : 'Is this an urgent matter or a media request?'}
        </span>
      </label>

      <button type="submit" className="btn btn-primary btn-lg">
        {lang === 'vi' ? 'Gửi tin nhắn' : 'Send'}
        <i data-lucide="send" className="icon-sm" />
      </button>
    </form>
  );
}
