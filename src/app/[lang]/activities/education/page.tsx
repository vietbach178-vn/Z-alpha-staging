import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/activities/education'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'activitiesEducation.metaTitle') };
}

export default async function ActivitiesEducationPage({ params }: PageProps<'/[lang]/activities/education'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <span className="glow glow-teal" />
        <span className="glow glow-blue" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="graduation-cap" className="icon-sm" />
            {t(dict, 'activitiesEducation.heroEyebrow')}
          </span>
          <h1>{t(dict, 'activitiesEducation.title')}</h1>
          <p className="section-lead">{t(dict, 'activitiesEducation.lead')}</p>
        </div>
      </section>

      {/* PILLARS overview */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'activitiesEducation.pillarsTitle')}
            </h2>
            <p className="section-lead" style={{ margin: '12px auto 0', maxWidth: 640 }}>
              {t(dict, 'activitiesEducation.pillarsLead')}
            </p>
          </div>

          <div className="focus-grid">
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="brain-circuit" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.pillar1Title')}</h3>
              <p>{t(dict, 'activitiesEducation.pillar1Body')}</p>
            </article>

            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="shield-check" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.pillar2Title')}</h3>
              <p>{t(dict, 'activitiesEducation.pillar2Body')}</p>
            </article>

            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="palette" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.pillar3Title')}</h3>
              <p>{t(dict, 'activitiesEducation.pillar3Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* PILLAR 1 — Understanding digital tech (4 modules CHT) */}
      <section className="section section--muted" id="pillar-understanding">
        <div className="container">
          <div className="section-header">
            <span className="hero-eyebrow" style={{ marginBottom: 12 }}>
              <i data-lucide="layers" className="icon-sm" />
              {t(dict, 'activitiesEducation.chtEyebrow')}
            </span>
            <h2 className="section-title">{t(dict, 'activitiesEducation.chtTitle')}</h2>
            <p className="section-lead">{t(dict, 'activitiesEducation.chtLead')}</p>
          </div>

          <div className="research-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="eye" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.chtMod1Title')}</h3>
              <p>{t(dict, 'activitiesEducation.chtMod1Body')}</p>
            </article>
            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="cpu" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.chtMod2Title')}</h3>
              <p>{t(dict, 'activitiesEducation.chtMod2Body')}</p>
            </article>
            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="brain" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.chtMod3Title')}</h3>
              <p>{t(dict, 'activitiesEducation.chtMod3Body')}</p>
            </article>
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="network" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.chtMod4Title')}</h3>
              <p>{t(dict, 'activitiesEducation.chtMod4Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* PILLAR 2 — UNESCO digital literacy (4 competencies) */}
      <section className="section" id="pillar-literacy">
        <div className="container">
          <div className="section-header">
            <span className="hero-eyebrow" style={{ marginBottom: 12 }}>
              <i data-lucide="award" className="icon-sm" />
              {t(dict, 'activitiesEducation.unescoEyebrow')}
            </span>
            <h2 className="section-title">{t(dict, 'activitiesEducation.unescoTitle')}</h2>
            <p className="section-lead">{t(dict, 'activitiesEducation.unescoLead')}</p>
          </div>

          <ul className="bullet-list">
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="shield-check" className="icon" /></span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--fg-1)' }}>{t(dict, 'activitiesEducation.unesco1Title')}</p>
                <p>{t(dict, 'activitiesEducation.unesco1Body')}</p>
              </div>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="hand" className="icon" /></span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--fg-1)' }}>{t(dict, 'activitiesEducation.unesco2Title')}</p>
                <p>{t(dict, 'activitiesEducation.unesco2Body')}</p>
              </div>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="heart-handshake" className="icon" /></span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--fg-1)' }}>{t(dict, 'activitiesEducation.unesco3Title')}</p>
                <p>{t(dict, 'activitiesEducation.unesco3Body')}</p>
              </div>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="lightbulb" className="icon" /></span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--fg-1)' }}>{t(dict, 'activitiesEducation.unesco4Title')}</p>
                <p>{t(dict, 'activitiesEducation.unesco4Body')}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* PILLAR 3 — Alternative activities (Art / Reading / Science) */}
      <section className="section section--muted" id="pillar-alternatives">
        <div className="container">
          <div className="section-header">
            <span className="hero-eyebrow" style={{ marginBottom: 12 }}>
              <i data-lucide="sparkles" className="icon-sm" />
              {t(dict, 'activitiesEducation.altEyebrow')}
            </span>
            <h2 className="section-title">{t(dict, 'activitiesEducation.altTitle')}</h2>
            <p className="section-lead">{t(dict, 'activitiesEducation.altLead')}</p>
          </div>

          <div className="focus-grid">
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="palette" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.altArtTitle')}</h3>
              <p>{t(dict, 'activitiesEducation.altArtBody')}</p>
            </article>
            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="book-open" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.altReadingTitle')}</h3>
              <p>{t(dict, 'activitiesEducation.altReadingBody')}</p>
            </article>
            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="microscope" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesEducation.altScienceTitle')}</h3>
              <p>{t(dict, 'activitiesEducation.altScienceBody')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* HAIDT QUOTE — principle-banner style */}
      <section className="section">
        <div className="container">
          <div className="principle-banner">
            <div className="principle-banner__icon">
              <i data-lucide="quote" className="icon-md" />
            </div>
            <p className="principle-banner__text">
              <em>“{t(dict, 'activitiesEducation.quoteText')}”</em>
            </p>
            <p style={{ margin: 0, color: 'var(--blue-700)', fontWeight: 600, fontSize: 14 }}>
              — {t(dict, 'activitiesEducation.quoteAuthor')}
            </p>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} />
    </>
  );
}
