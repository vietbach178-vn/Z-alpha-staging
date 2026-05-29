import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, localizedHref, t, type Lang } from '@/lib/i18n';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'about.metaTitle') };
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  return (
    <>
      {/* HERO — slide 5 layout */}
      <section className="hero">
        <span className="glow glow-teal" />
        <span className="glow glow-orange" />

        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="sparkles" className="icon-sm" />
            {t(dict, 'about.heroEyebrow')}
          </span>

          <h1 className="slogan">
            <span className="line l-teal">{t(dict, 'about.heroSlogan1')}</span>
            <span className="line l-blue">{t(dict, 'about.heroSlogan2')}</span>
            <span className="line l-orange">{t(dict, 'about.heroSlogan3')}</span>
          </h1>

          <p className="hero-subline">{t(dict, 'about.heroSubline')}</p>
        </div>
      </section>

      {/* INTRO + MISSION — slide 3-4 narrative */}
      <section className="section" id="about-intro">
        <div className="container">
          <div className="what-grid">
            <div>
              <div className="section-header" style={{ marginBottom: 0 }}>
                <h2 className="section-title">{t(dict, 'about.introTitle')}</h2>
                <p className="section-lead">{t(dict, 'about.introBody')}</p>
              </div>
            </div>
            <div>
              <div className="section-header" style={{ marginBottom: 0 }}>
                <h2 className="section-title">{t(dict, 'about.missionTitle')}</h2>
                <p className="section-lead">{t(dict, 'about.missionBody')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS — slide 5 */}
      <section className="section section--muted" id="about-pillars">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'about.pillarsTitle')}
            </h2>
            <p className="section-lead" style={{ margin: '12px auto 0', maxWidth: 640 }}>
              {t(dict, 'about.pillarsLead')}
            </p>
          </div>

          <div className="focus-grid">
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="microscope" className="icon-lg" /></div>
              <h3>{t(dict, 'about.pillar1Title')}</h3>
              <p>{t(dict, 'about.pillar1Body')}</p>
              <Link href={localizedHref('activities/research', lang)} className="focus-link">
                {t(dict, 'about.pillar1Cta')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>

            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="landmark" className="icon-lg" /></div>
              <h3>{t(dict, 'about.pillar2Title')}</h3>
              <p>{t(dict, 'about.pillar2Body')}</p>
              <Link href={localizedHref('activities/policy', lang)} className="focus-link">
                {t(dict, 'about.pillar2Cta')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>

            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="graduation-cap" className="icon-lg" /></div>
              <h3>{t(dict, 'about.pillar3Title')}</h3>
              <p>{t(dict, 'about.pillar3Body')}</p>
              <Link href={localizedHref('activities/education', lang)} className="focus-link">
                {t(dict, 'about.pillar3Cta')}
                <i data-lucide="arrow-right" className="icon-sm" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} />
    </>
  );
}
