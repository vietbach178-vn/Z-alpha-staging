'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { localizedHref, swapLang } from '@/lib/i18n';

interface Dict {
  brand: { eyebrow: string };
  nav: { about: string; research: string; news: string; team: string; contact: string };
}

interface Props { lang: Lang; dict: Dict }

export default function Header({ lang, dict }: Props) {
  const pathname = usePathname() ?? `/${lang}`;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const home = localizedHref('', lang);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const items = [
    { href: home,                                 label: dict.nav.about },
    { href: localizedHref('research', lang),      label: dict.nav.research },
    { href: localizedHref('news', lang),          label: dict.nav.news },
    { href: localizedHref('team', lang),          label: dict.nav.team },
    { href: localizedHref('contact', lang),       label: dict.nav.contact },
  ];

  return (
    <header className="site-header">
      <div className="container">
        <Link href={home} className="brand" aria-label="Z & Alpha — Trang chủ">
          <div className="brand-mark">
            <img src="/assets/logo.png" alt="Z & Alpha" />
          </div>
          <div className="brand-name">
            <span className="eyebrow">{dict.brand.eyebrow}</span>
            <span className="strong">Z &amp; Alpha</span>
          </div>
        </Link>

        <nav className="nav" aria-label={lang === 'vi' ? 'Điều hướng chính' : 'Main navigation'}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={isActive(it.href) && it.href !== home ? 'is-active' : ''}
              aria-current={isActive(it.href) && it.href !== home ? 'page' : undefined}
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="lang-toggle" role="group" aria-label="Language">
            <Link href={swapLang(pathname, 'vi')} className={lang === 'vi' ? 'is-active' : ''}>VI</Link>
            <Link href={swapLang(pathname, 'en')} className={lang === 'en' ? 'is-active' : ''}>EN</Link>
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="menu-btn__bar" />
            <span className="menu-btn__bar" />
            <span className="menu-btn__bar" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!menuOpen}>
        <nav aria-label={lang === 'vi' ? 'Điều hướng mobile' : 'Mobile navigation'}>
          {items.map((it) => (
            <Link key={it.href} href={it.href}>{it.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
