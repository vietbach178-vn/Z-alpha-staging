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

export default async function AboutSocialMediaPage({ params }: PageProps<'/[lang]/about/social-media-vietnam'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  // t() only returns strings; access array nodes directly off the dict.
  const features = (dict as unknown as { aboutSocialMedia?: { features?: Feature[] } }).aboutSocialMedia?.features ?? [];
  const direct = (dict as unknown as { aboutSocialMedia?: { direct?: ImpactItem[] } }).aboutSocialMedia?.direct ?? [];
  const indirect = (dict as unknown as { aboutSocialMedia?: { indirect?: ImpactItem[] } }).aboutSocialMedia?.indirect ?? [];

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <div className="about-hero">
            <span className="about-hero__eyebrow">
              <i data-lucide="info" className="icon-sm" />
              {t(dict, 'aboutSocialMedia.heroEyebrow')}
            </span>
            <h1 className="about-hero__title">{t(dict, 'aboutSocialMedia.heroTitle')}</h1>
            <p className="about-hero__subtitle">{t(dict, 'aboutSocialMedia.heroSubtitle')}</p>
            <p className="about-hero__lead">{t(dict, 'aboutSocialMedia.heroLead')}</p>
          </div>
        </div>
      </section>

      {/* Scholar + Quote + VN context */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="scholar-row">
            <div className="scholar-card">
              <div className="scholar-card__top">
                <div className="scholar-card__avatar">
                  <i data-lucide="graduation-cap" className="icon-lg" />
                </div>
                <div>
                  <h3 className="scholar-card__name">{t(dict, 'aboutSocialMedia.scholar.name')}</h3>
                  <p className="scholar-card__role">{t(dict, 'aboutSocialMedia.scholar.role')}</p>
                </div>
              </div>
              <p className="scholar-card__meta">
                <strong>{t(dict, 'aboutSocialMedia.scholar.phdLabel')}:</strong>{' '}
                {t(dict, 'aboutSocialMedia.scholar.phd')}
              </p>
              <p className="scholar-card__meta">
                <strong>{t(dict, 'aboutSocialMedia.scholar.expertiseLabel')}:</strong>{' '}
                {t(dict, 'aboutSocialMedia.scholar.expertise')}
              </p>
              <p className="scholar-card__meta">
                <strong>{t(dict, 'aboutSocialMedia.scholar.publishedLabel')}:</strong>{' '}
                {t(dict, 'aboutSocialMedia.scholar.published')}
              </p>
              <p className="scholar-card__meta">
                <strong>{t(dict, 'aboutSocialMedia.scholar.scopeLabel')}:</strong>{' '}
                {t(dict, 'aboutSocialMedia.scholar.scope')}
              </p>
            </div>

            <div className="about-aside">
              <div className="quote-card-dark">
                <span className="quote-card-dark__text">{t(dict, 'aboutSocialMedia.quote')}</span>
              </div>
              <div className="vn-context-card">
                <h3>{t(dict, 'aboutSocialMedia.vnContextHeading')}</h3>
                <p>{t(dict, 'aboutSocialMedia.vnContextBody')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features 01/02/03 */}
      <section className="section">
        <div className="container">
          <h2 className="research-section-title" style={{ marginBottom: 24 }}>
            {t(dict, 'aboutSocialMedia.featuresHeading')}
          </h2>
          <div className="numbered-grid">
            {features.map((f) => (
              <div key={f.num} className={`numbered-card t-${f.tone}`}>
                <div className="numbered-card__head">
                  <div className="numbered-card__icon">
                    <i data-lucide={f.icon} className="icon-lg" />
                  </div>
                  <span className="numbered-card__num">{f.num}</span>
                </div>
                <h3 className="numbered-card__label">{f.label}</h3>
                <p className="numbered-card__labelEn">{f.labelEn}</p>
                <p className="numbered-card__body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact direct / indirect */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="impact-block">
            <h2 className="impact-block__title">{t(dict, 'aboutSocialMedia.impactHeading')}</h2>
            <p className="impact-block__lead">{t(dict, 'aboutSocialMedia.impactLead')}</p>

            <div className="impact-header">
              <div className="impact-pill t-blue">{t(dict, 'aboutSocialMedia.impactDirect')}</div>
              <div className="impact-pill-center">{t(dict, 'aboutSocialMedia.impactCenter')}</div>
              <div className="impact-pill t-red">{t(dict, 'aboutSocialMedia.impactIndirect')}</div>
            </div>

            <div className="impact-grid">
              <div className="impact-col t-blue">
                {direct.map((it, i) => (
                  <div key={i} className="impact-card">
                    <h4>{it.title}</h4>
                    <p>{it.body}</p>
                  </div>
                ))}
              </div>
              <div className="impact-col t-red">
                {indirect.map((it, i) => (
                  <div key={i} className="impact-card">
                    <h4>{it.title}</h4>
                    <p>{it.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} muted />
    </>
  );
}
