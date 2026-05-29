'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';
import { localizedHref, swapLang } from '@/lib/i18n';

interface Dict {
  brand: { eyebrow: string };
  nav: {
    about: string;
    activities: string;
    news: string;
    library: string;
    contact: string;
    aboutMenu: { overview: string; team: string };
    activitiesMenu: { education: string; policy: string; research: string };
  };
}

interface Props { lang: Lang; dict: Dict }

export default function Header({ lang, dict }: Props) {
  const pathname = usePathname() ?? `/${lang}`;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const home = localizedHref('', lang);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const aboutHref = localizedHref('about', lang);
  const activitiesResearchHref = localizedHref('activities/research', lang);

  const aboutChildren = [
    { href: aboutHref,                          label: dict.nav.aboutMenu.overview },
    { href: localizedHref('about/team', lang),  label: dict.nav.aboutMenu.team },
  ];

  const activitiesChildren = [
    { href: localizedHref('activities/education', lang), label: dict.nav.activitiesMenu.education },
    { href: localizedHref('activities/policy', lang),    label: dict.nav.activitiesMenu.policy },
    { href: activitiesResearchHref,                       label: dict.nav.activitiesMenu.research },
  ];

  const items = [
    { href: localizedHref('news', lang),    label: dict.nav.news },
    { href: localizedHref('library', lang), label: dict.nav.library },
    { href: localizedHref('contact', lang), label: dict.nav.contact },
  ];

  const aboutActive = pathname.startsWith(aboutHref);
  const activitiesActive = pathname.startsWith(localizedHref('activities', lang));

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
          <div className="nav-dropdown">
            <Link
              href={aboutHref}
              className={`nav-dropdown__trigger ${aboutActive ? 'is-active' : ''}`}
              aria-haspopup="true"
            >
              {dict.nav.about}
              <span className="nav-dropdown__caret" aria-hidden="true">▾</span>
            </Link>
            <div className="nav-dropdown__menu" role="menu">
              {aboutChildren.map((c) => (
                <Link key={c.href} href={c.href} className="nav-dropdown__item" role="menuitem">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="nav-dropdown">
            <Link
              href={activitiesResearchHref}
              className={`nav-dropdown__trigger ${activitiesActive ? 'is-active' : ''}`}
              aria-haspopup="true"
            >
              {dict.nav.activities}
              <span className="nav-dropdown__caret" aria-hidden="true">▾</span>
            </Link>
            <div className="nav-dropdown__menu" role="menu">
              {activitiesChildren.map((c) => (
                <Link key={c.href} href={c.href} className="nav-dropdown__item" role="menuitem">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={isActive(it.href) ? 'is-active' : ''}
              aria-current={isActive(it.href) ? 'page' : undefined}
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
          <div className="mobile-menu__group">
            <span className="mobile-menu__group-label">{dict.nav.about}</span>
            {aboutChildren.map((c) => (
              <Link key={c.href} href={c.href} className="mobile-menu__sub">{c.label}</Link>
            ))}
          </div>
          <div className="mobile-menu__group">
            <span className="mobile-menu__group-label">{dict.nav.activities}</span>
            {activitiesChildren.map((c) => (
              <Link key={c.href} href={c.href} className="mobile-menu__sub">{c.label}</Link>
            ))}
          </div>
          {items.map((it) => (
            <Link key={it.href} href={it.href}>{it.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
