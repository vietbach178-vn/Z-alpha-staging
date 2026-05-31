import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { localizedHref } from '@/lib/i18n';

interface Dict {
  contactCta: { title: string; lead: string; button: string };
}

interface Props { dict: Dict; lang: Lang; muted?: boolean }

export default function ContactCta({ dict, lang, muted = false }: Props) {
  return (
    <section className={muted ? 'section section--muted' : 'section'}>
      <div className="container">
        <div className="contact-cta">
          <div>
            <h2 className="contact-cta__title">{dict.contactCta.title}</h2>
            <p className="contact-cta__lead">{dict.contactCta.lead}</p>
          </div>
          <Link href={localizedHref('contact', lang)} className="btn btn-dark">
            {dict.contactCta.button}
            <i data-lucide="arrow-right" className="icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
