import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import ContactCta from '@/components/public/ContactCta';

export async function generateMetadata({ params }: PageProps<'/[lang]/activities/education'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'activitiesEducation.metaTitle') };
}

type SkillItem = { icon: string; text: string };
type SkillGroup = { roman: string; title: string; items: SkillItem[] };

// Tô màu một keyword đặc trưng trong title theo tone của trụ cột (chỉ phần keyword đổi màu).
// Tìm không phân biệt hoa/thường; không khớp (vd bản EN) thì trả về title nguyên vẹn.
function highlightKeyword(title: string, keyword: string, color: string) {
  const i = title.toLowerCase().indexOf(keyword.toLowerCase());
  if (i === -1) return title;
  return (
    <>
      {title.slice(0, i)}
      <span style={{ color }}>{title.slice(i, i + keyword.length)}</span>
      {title.slice(i + keyword.length)}
    </>
  );
}

// Keyword + màu tone cho từng trụ cột (TC1 teal, TC2 blue, TC3 orange)
const PILLAR_HL = [
  { kw: 'sức khỏe tinh thần', color: 'var(--teal-600)' },
  { kw: 'kỹ năng số', color: 'var(--blue-600)' },
  { kw: 'thay thế', color: 'var(--orange-600)' },
];

export default async function ActivitiesEducationPage({ params }: PageProps<'/[lang]/activities/education'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const edu = (dict as { activitiesEducation: Record<string, unknown> }).activitiesEducation;
  const skillGroups = edu.skillGroups as SkillGroup[];

  const alternatives = [
    { icon: 'palette',       title: 'altArtTitle',     body: 'altArtBody',     tone: 't-orange' },
    { icon: 'book-open',     title: 'altReadingTitle', body: 'altReadingBody', tone: 't-orange' },
    { icon: 'flask-conical', title: 'altScienceTitle', body: 'altScienceBody', tone: 't-orange' },
  ];

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

      {/* OVERVIEW — 3 trụ cột */}
      <section className="section section--muted">
        <div className="container">
          <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
            <h2 className="section-title" style={{ margin: '0 auto', maxWidth: 760 }}>
              {t(dict, 'activitiesEducation.pillarsTitle')}
            </h2>
          </div>

          <div className="focus-grid">
            <article className="focus-card focus-card--overview t-teal">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="brain-circuit" className="icon-lg" /></div>
                <span className="focus-eyebrow">{t(dict, 'activitiesEducation.chtEyebrow')}</span>
              </div>
              <h3>{highlightKeyword(t(dict, 'activitiesEducation.pillar1Title'), PILLAR_HL[0].kw, PILLAR_HL[0].color)}</h3>
              <p className="focus-label">{t(dict, 'activitiesEducation.pillar1Label')}</p>
              <p>{t(dict, 'activitiesEducation.pillar1Body')}</p>
            </article>
            <article className="focus-card focus-card--overview t-blue">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="shield-check" className="icon-lg" /></div>
                <span className="focus-eyebrow">{t(dict, 'activitiesEducation.skillsEyebrow')}</span>
              </div>
              <h3>{highlightKeyword(t(dict, 'activitiesEducation.pillar2Title'), PILLAR_HL[1].kw, PILLAR_HL[1].color)}</h3>
              <p className="focus-label">{t(dict, 'activitiesEducation.pillar2Label')}</p>
              <p>{t(dict, 'activitiesEducation.pillar2Body')}</p>
            </article>
            <article className="focus-card focus-card--overview t-orange">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="palette" className="icon-lg" /></div>
                <span className="focus-eyebrow">{t(dict, 'activitiesEducation.altEyebrow')}</span>
              </div>
              <h3>{highlightKeyword(t(dict, 'activitiesEducation.pillar3Title'), PILLAR_HL[2].kw, PILLAR_HL[2].color)}</h3>
              <p className="focus-label">{t(dict, 'activitiesEducation.pillar3Label')}</p>
              <p>{t(dict, 'activitiesEducation.pillar3Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* TRỤ CỘT 1 — Nhận thức công nghệ số & sức khỏe tinh thần */}
      <section className="section" id="pillar-wellbeing">
        <div className="container">
          <span className="s-eyebrow t-teal">
            <span className="s-eyebrow__num">01</span>
            <span className="s-eyebrow__label">{t(dict, 'activitiesEducation.chtEyebrow')}</span>
          </span>
          <div className="section-header">
            <h2 className="section-title">{highlightKeyword(t(dict, 'activitiesEducation.pillar1Title'), PILLAR_HL[0].kw, PILLAR_HL[0].color)}</h2>
          </div>

          <div className="focus-grid focus-grid--2col">
            <article className="focus-card t-teal">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="eye" className="icon-lg" /></div>
                <h3>{t(dict, 'activitiesEducation.chtMod1Title')}</h3>
              </div>
              <p>{t(dict, 'activitiesEducation.chtMod1Body')}</p>
            </article>
            <article className="focus-card t-teal">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="cpu" className="icon-lg" /></div>
                <h3>{t(dict, 'activitiesEducation.chtMod2Title')}</h3>
              </div>
              <p>{t(dict, 'activitiesEducation.chtMod2Body')}</p>
            </article>
            <article className="focus-card t-teal">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="brain" className="icon-lg" /></div>
                <h3>{t(dict, 'activitiesEducation.chtMod3Title')}</h3>
              </div>
              <p>{t(dict, 'activitiesEducation.chtMod3Body')}</p>
            </article>
            <article className="focus-card t-teal">
              <div className="focus-card__top">
                <div className="icon-tile"><i data-lucide="network" className="icon-lg" /></div>
                <h3>{t(dict, 'activitiesEducation.chtMod4Title')}</h3>
              </div>
              <p>{t(dict, 'activitiesEducation.chtMod4Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* TRỤ CỘT 2 — Kỹ năng số (khung năng lực I–V) */}
      <section className="section section--muted" id="pillar-skills">
        <div className="container">
          <span className="s-eyebrow t-blue">
            <span className="s-eyebrow__num">02</span>
            <span className="s-eyebrow__label">{t(dict, 'activitiesEducation.skillsEyebrow')}</span>
          </span>
          <div className="section-header">
            <h2 className="section-title">{highlightKeyword(t(dict, 'activitiesEducation.pillar2Title'), PILLAR_HL[1].kw, PILLAR_HL[1].color)}</h2>
            <p className="section-lead">{t(dict, 'activitiesEducation.skillsLead')}</p>
          </div>

          <div className="skill-rows">
            {skillGroups.map((g) => (
              <div key={g.roman} className="skill-row t-blue">
                <span className="skill-row__roman">{g.roman}</span>
                <div className="skill-row__body">
                  <h3 className="skill-row__title">{g.title}</h3>
                  <ul className="skill-list">
                    {g.items.map((it) => (
                      <li key={it.text} className="skill-item">
                        <span className="skill-item__ico"><i data-lucide={it.icon} className="icon-sm" /></span>
                        <span>{it.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRỤ CỘT 3 — Hoạt động thay thế (nghệ thuật / đọc / khoa học) */}
      <section className="section" id="pillar-alternatives">
        <div className="container">
          <span className="s-eyebrow t-orange">
            <span className="s-eyebrow__num">03</span>
            <span className="s-eyebrow__label">{t(dict, 'activitiesEducation.altEyebrow')}</span>
          </span>
          <div className="section-header">
            <h2 className="section-title">{highlightKeyword(t(dict, 'activitiesEducation.pillar3Title'), PILLAR_HL[2].kw, PILLAR_HL[2].color)}</h2>
            <p className="section-lead">{t(dict, 'activitiesEducation.altTitle')}</p>
          </div>

          {alternatives.map((a, i) => (
            <div key={a.title} className={`media-row ${a.tone} ${i % 2 === 1 ? 'media-row--rev' : ''}`}>
              <div className="media-row__media"><i data-lucide={a.icon} className="icon-2xl" /></div>
              <div className="media-row__body">
                <h3>{t(dict, `activitiesEducation.${a.title}`)}</h3>
                <p>{t(dict, `activitiesEducation.${a.body}`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LỜI MỜI HỢP TÁC */}
      <section className="section section--muted">
        <div className="container">
          <div className="principle-banner">
            <div className="principle-banner__icon">
              <i data-lucide="handshake" className="icon-md" />
            </div>
            <h2 className="section-title" style={{ fontSize: 24 }}>{t(dict, 'activitiesEducation.inviteTitle')}</h2>
            {t(dict, 'activitiesEducation.inviteBody').split('\n\n').map((para, i) => (
              <p key={i} className="principle-banner__text" style={{ fontStyle: 'normal' }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      <ContactCta dict={dict} lang={lang} />
    </>
  );
}
