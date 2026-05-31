import Link from 'next/link';
import type { Metadata } from 'next';
import { isLang, getDictionary, localizedHref, t, type Lang } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import ContactCta from '@/components/public/ContactCta';

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: t(dict, 'home.metaTitle'),
    description: t(dict, 'home.metaDescription'),
  };
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = await getDictionary(lang);
  const l = lang as Lang;

  // Featured: fallback to hardcoded 72h-no-facebook until CMS publishes
  const fSlug = t(dict, 'home.featured.fallbackSlug');
  const fTitle = t(dict, 'home.featured.fallbackTitle');
  const fDesc = t(dict, 'home.featured.fallbackDesc');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <span className="glow glow-teal" />
        <span className="glow glow-orange" />

        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="sparkles" className="icon-sm" />
            {t(dict, 'home.hero.eyebrow')}
          </span>

          <h1 className="slogan">
            <span className="line l-teal">{t(dict, 'home.hero.slogan1')}</span>
            <span className="line l-blue">{t(dict, 'home.hero.slogan2')}</span>
            <span className="line l-orange">{t(dict, 'home.hero.slogan3')}</span>
          </h1>

          <p className="hero-subline">{t(dict, 'home.hero.subline')}</p>
          <p className="hero-body">{t(dict, 'home.hero.body')}</p>

          <div className="hero-actions">
            <Link href={localizedHref('activities/research', l)} className="btn btn-primary btn-lg">
              {t(dict, 'home.hero.ctaPrimary')}
              <i data-lucide="arrow-right" className="icon" />
            </Link>
            <Link href={localizedHref('about', l)} className="btn btn-outline btn-lg">
              {t(dict, 'home.hero.ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED RESEARCH */}
      <section className="section section--muted" id="research">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {t(dict, 'home.featured.titlePrefix')}{' '}
              <span className="accent-blue">{t(dict, 'home.featured.titleAccent')}</span>
            </h2>
          </div>

          <article className="featured-hero">
            <div className="featured-hero__body">
              <div className="featured-hero__icons" aria-hidden="true">
                <div className="t1"><i data-lucide="users" className="icon-md" /></div>
                <div className="t3"><i data-lucide="brain" className="icon-md" /></div>
                <div className="t2"><i data-lucide="message-circle-off" className="icon-md" /></div>
              </div>
              <span className="badge">
                <i data-lucide="file-text" className="icon-sm" />
                {t(dict, 'home.featured.badge')}
              </span>
              <h3 className="featured-hero__title">{fTitle}</h3>
              <p className="featured-hero__desc">{fDesc}</p>
              <Link href={localizedHref(`activities/research/${fSlug}`, l)} className="link-inline">
                {t(dict, 'common.readMoreInline')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </div>
          </article>

          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
            <Link href={localizedHref('activities/research', l)} className="btn btn-outline">
              {t(dict, 'home.featured.viewAllBtn')}
              <i data-lucide="arrow-right" className="icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section" id="about">
        <div className="container">
          <div className="what-grid">
            <div>
              <div className="section-header" style={{ marginBottom: 0 }}>
                <h2 className="section-title">
                  {t(dict, 'home.what.titlePrefix')}{' '}
                  <span className="accent-teal">{t(dict, 'home.what.titleAccent')}</span>
                </h2>
                <p className="section-lead">{t(dict, 'home.what.lead')}</p>
              </div>
            </div>

            <div>
              <p style={{ margin: '0 0 16px', fontWeight: 600, color: 'var(--fg-1)', fontSize: 16 }}>
                {t(dict, 'home.what.intro')}
              </p>

              <ul className="bullet-list">
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="microscope" className="icon" /></span>
                  <p>{t(dict, 'home.what.bullet1')}</p>
                </li>
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="scale" className="icon" /></span>
                  <p>{t(dict, 'home.what.bullet2')}</p>
                </li>
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="megaphone" className="icon" /></span>
                  <p>{t(dict, 'home.what.bullet3')}</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="principle-banner">
            <div className="principle-banner__icon">
              <i data-lucide="shield-check" className="icon-md" />
            </div>
            <p
              className="principle-banner__text"
              dangerouslySetInnerHTML={{ __html: t(dict, 'home.what.principleText') }}
            />
          </div>
        </div>
      </section>

      {/* MEDIA — VTV2 feature */}
      <section className="section section--muted" id="media">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="hero-eyebrow" style={{ marginBottom: 12 }}>
              <i data-lucide="tv" className="icon-sm" />
              {t(dict, 'home.media.eyebrow')}
            </span>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'home.media.titlePrefix')}{' '}
              <span className="accent-blue">{t(dict, 'home.media.titleAccent')}</span>
            </h2>
            <p className="section-lead" style={{ margin: '12px auto 0', maxWidth: 640 }}>
              {t(dict, 'home.media.lead')}
            </p>
          </div>

          <div className="media-feature">
            <div className="media-feature__video">
              <iframe
                src="https://drive.google.com/file/d/1J4Bsqdq8nMU5D3_XwMzsyetqCe5G9_NC/preview"
                title="Z & Alpha trên VTV2 — Hiểu Sâu Sống Chất"
                allow="autoplay"
                allowFullScreen
                loading="lazy"
              />
              {/* Masks Google Drive's native pop-out (↗) control in the top-right */}
              <span className="media-feature__mask" aria-hidden="true" />
            </div>
            <p
              className="media-feature__caption"
              dangerouslySetInnerHTML={{ __html: t(dict, 'home.media.caption') }}
            />
          </div>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto' }}>{t(dict, 'home.focus.title')}</h2>
          </div>

          <div className="focus-grid">
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="graduation-cap" className="icon-lg" /></div>
              <h3>{t(dict, 'home.focus.card1.title')}</h3>
              <p>{t(dict, 'home.focus.card1.body')}</p>
              <Link href={localizedHref('activities/education', l)} className="focus-link">
                {t(dict, 'home.focus.card1.linkLabel')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>

            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="landmark" className="icon-lg" /></div>
              <h3>{t(dict, 'home.focus.card2.title')}</h3>
              <p>{t(dict, 'home.focus.card2.body')}</p>
              <Link href={localizedHref('activities/policy', l)} className="focus-link">
                {t(dict, 'home.focus.card2.linkLabel')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>

            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="lightbulb" className="icon-lg" /></div>
              <h3>{t(dict, 'home.focus.card3.title')}</h3>
              <p>{t(dict, 'home.focus.card3.body')}</p>
              <Link href={localizedHref('activities/research', l)} className="focus-link">
                {t(dict, 'home.focus.card3.linkLabel')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <ContactCta dict={dict} lang={lang} muted />
    </>
  );
}
