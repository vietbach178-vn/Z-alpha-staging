import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { localizedHref } from '@/lib/i18n';

interface Dict {
  brand: { eyebrow: string };
  nav: {
    about: string;
    activities: string;
    news: string;
    library: string;
    contact: string;
    activitiesMenu: { research: string };
  };
  footer: {
    tagline: string;
    linksHeading: string;
    contactHeading: string;
    address: string;
    phone: string;
    email: string;
    rights: string;
    iconsBy: string;
    privacy: string;
  };
}

interface Props { lang: Lang; dict: Dict }

export default function Footer({ lang, dict }: Props) {
  const year = new Date().getFullYear();
  const home = localizedHref('', lang);
  const phoneHref = `tel:${dict.footer.phone.replace(/\s/g, '')}`;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={home} className="brand">
              <div className="brand-mark">
                <img src="/assets/logo.png" alt="Z & Alpha Initiative" />
              </div>
              <div className="brand-name">
                <span className="eyebrow">{dict.brand.eyebrow}</span>
                <span className="strong">Z &amp; Alpha</span>
              </div>
            </Link>
            <p className="tagline" dangerouslySetInnerHTML={{ __html: dict.footer.tagline }} />
          </div>

          <div className="footer-col">
            <h4>{dict.footer.linksHeading}</h4>
            <ul>
              <li><Link href={localizedHref('about', lang)}>{dict.nav.about}</Link></li>
              <li><Link href={localizedHref('activities/research', lang)}>{dict.nav.activities}</Link></li>
              <li><Link href={localizedHref('news', lang)}>{dict.nav.news}</Link></li>
              <li><Link href={localizedHref('library', lang)}>{dict.nav.library}</Link></li>
              <li><Link href={localizedHref('contact', lang)}>{dict.nav.contact}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{dict.footer.contactHeading}</h4>
            <ul>
              <li>
                <i data-lucide="map-pin" className="icon-sm contact-glyph" />
                <span>{dict.footer.address}</span>
              </li>
              <li>
                <i data-lucide="phone" className="icon-sm contact-glyph" />
                <a href={phoneHref}>{dict.footer.phone}</a>
              </li>
              <li>
                <i data-lucide="mail" className="icon-sm contact-glyph" />
                <a href={`mailto:${dict.footer.email}`}>{dict.footer.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ margin: 0 }}>{dict.footer.rights.replace('{year}', String(year))}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="https://lucide.dev" target="_blank" rel="noopener">{dict.footer.iconsBy}</a>
            <span className="dot">|</span>
            <a href="#">{dict.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
