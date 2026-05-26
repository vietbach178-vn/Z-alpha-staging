import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import Newsletter from '@/components/public/Newsletter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[lang]/about/social-media-vietnam'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'aboutSocialMedia.metaTitle') };
}

interface Feature {
  num: string;
  icon: string;
  tone: string;
  label: string;
  labelEn: string;
  body: string;
}

interface ImpactItem {
  title: string;
  body: string;
}

const FEATURE_ICONS = ['link', 'message-circle', 'shuffle'];
const FEATURE_TONES: Array<'t-blue' | 't-teal' | 't-orange'> = ['t-blue', 't-teal', 't-orange'];

export default async function AboutSocialMediaPage({ params }: PageProps<'/[lang]/about/social-media-vietnam'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const data = (dict as unknown as {
    aboutSocialMedia?: {
      features?: Feature[];
      direct?: ImpactItem[];
      indirect?: ImpactItem[];
    };
  }).aboutSocialMedia ?? {};
  const features = data.features ?? [];
  const direct = data.direct ?? [];
  const indirect = data.indirect ?? [];

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <span className="glow glow-teal" />
        <span className="glow glow-blue" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="info" className="icon-sm" />
            {t(dict, 'aboutSocialMedia.heroEyebrow')}
          </span>
          <h1>{t(dict, 'aboutSocialMedia.heroTitle')}</h1>
          <p className="section-lead">{t(dict, 'aboutSocialMedia.heroSubtitle')}</p>
        </div>
      </section>

      {/* SCHOLAR + QUOTE */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="what-grid">
            <div>
              <div className="section-header" style={{ marginBottom: 0 }}>
                <span className="hero-eyebrow" style={{ marginBottom: 12 }}>
                  <i data-lucide="graduation-cap" className="icon-sm" />
                  {lang === 'vi' ? 'Bối cảnh khoa học' : 'Scientific context'}
                </span>
                <h2 className="section-title">
                  {t(dict, 'aboutSocialMedia.scholar.name')}
                </h2>
                <p className="section-lead">{t(dict, 'aboutSocialMedia.scholar.role')}</p>
                <p style={{ marginTop: 12, color: 'var(--fg-3)', fontSize: 15 }}>
                  {t(dict, 'aboutSocialMedia.heroLead')}
                </p>
              </div>
            </div>

            <div>
              <ul className="bullet-list">
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="award" className="icon" /></span>
                  <p>
                    <strong>{t(dict, 'aboutSocialMedia.scholar.phdLabel')}: </strong>
                    {t(dict, 'aboutSocialMedia.scholar.phd')}
                  </p>
                </li>
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="book-open" className="icon" /></span>
                  <p>
                    <strong>{t(dict, 'aboutSocialMedia.scholar.expertiseLabel')}: </strong>
                    {t(dict, 'aboutSocialMedia.scholar.expertise')}
                  </p>
                </li>
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="calendar" className="icon" /></span>
                  <p>
                    <strong>{t(dict, 'aboutSocialMedia.scholar.publishedLabel')}: </strong>
                    {t(dict, 'aboutSocialMedia.scholar.published')}
                  </p>
                </li>
                <li className="bullet-item">
                  <span className="glyph"><i data-lucide="globe" className="icon" /></span>
                  <p>
                    <strong>{t(dict, 'aboutSocialMedia.scholar.scopeLabel')}: </strong>
                    {t(dict, 'aboutSocialMedia.scholar.scope')}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* QUOTE */}
          <div className="principle-banner">
            <div className="principle-banner__icon">
              <i data-lucide="quote" className="icon-md" />
            </div>
            <p className="principle-banner__text">
              {t(dict, 'aboutSocialMedia.quote')}
            </p>
          </div>
        </div>
      </section>

      {/* BỐI CẢNH VIỆT NAM */}
      <section className="section section--muted">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="hero-eyebrow" style={{ marginBottom: 8 }}>
              <i data-lucide="map-pin" className="icon-sm" />
              {lang === 'vi' ? 'Bối cảnh' : 'Context'}
            </span>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'aboutSocialMedia.vnContextHeading')}
            </h2>
            <p className="section-lead" style={{ margin: '12px auto 0', maxWidth: 760 }}>
              {t(dict, 'aboutSocialMedia.vnContextBody')}
            </p>
          </div>
        </div>
      </section>

      {/* 3 ĐẶC ĐIỂM MÔI TRƯỜNG SỐ → focus-card */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'aboutSocialMedia.featuresHeading')}
            </h2>
          </div>

          <div className="focus-grid">
            {features.map((f, i) => {
              const tone = FEATURE_TONES[i] ?? 't-blue';
              const icon = FEATURE_ICONS[i] ?? 'circle';
              return (
                <article key={i} className={`focus-card ${tone}`}>
                  <div className="icon-tile"><i data-lucide={icon} className="icon-lg" /></div>
                  <h3>{f.label}</h3>
                  <p>{f.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* TÁC ĐỘNG TRỰC TIẾP / GIÁN TIẾP */}
      <section className="section section--muted">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto' }}>
              {t(dict, 'aboutSocialMedia.impactHeading')}
            </h2>
            <p className="section-lead" style={{ margin: '12px auto 0', maxWidth: 820 }}>
              {t(dict, 'aboutSocialMedia.impactLead')}
            </p>
          </div>

          <div className="what-grid">
            <div>
              <div className="section-header" style={{ marginBottom: 8 }}>
                <h3 className="t-h4" style={{ margin: 0, color: 'var(--blue-700)' }}>
                  {t(dict, 'aboutSocialMedia.impactDirect')}
                </h3>
              </div>
              <ul className="bullet-list">
                {direct.map((it, i) => (
                  <li key={i} className="bullet-item">
                    <span className="glyph"><i data-lucide="alert-circle" className="icon" /></span>
                    <p>
                      <strong>{it.title}.</strong> {it.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="section-header" style={{ marginBottom: 8 }}>
                <h3 className="t-h4" style={{ margin: 0, color: 'var(--red-700)' }}>
                  {t(dict, 'aboutSocialMedia.impactIndirect')}
                </h3>
              </div>
              <ul className="bullet-list">
                {indirect.map((it, i) => (
                  <li key={i} className="bullet-item">
                    <span className="glyph"><i data-lucide="shield-alert" className="icon" /></span>
                    <p>
                      <strong>{it.title}.</strong> {it.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} muted />
    </>
  );
}
