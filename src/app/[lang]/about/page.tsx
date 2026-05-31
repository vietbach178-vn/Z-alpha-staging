import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'about.metaTitle') };
}

type Trait = { num: string; title: string; en: string };
type Impact = { icon: string; term: string; en: string };
type Block = { icon: string; title: string; body: string };

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const about = (dict as { about: Record<string, unknown> }).about;
  const traits = about.traits as Trait[];
  const directImpacts = about.directImpacts as Impact[];
  const indirectImpacts = about.indirectImpacts as Impact[];
  const challenges = about.challenges as Block[];
  const solutions = about.solutions as Block[];
  const author = t(dict, 'about.quoteAuthor');

  return (
    <>
      {/* HERO — Z & Alpha + chủ đề Great Rewiring */}
      <section className="hero">
        <span className="glow glow-teal" />
        <span className="glow glow-blue" />
        <span className="glow glow-orange" />

        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="sparkles" className="icon-sm" />
            {t(dict, 'about.heroEyebrow')}
          </span>

          <h1
            className="slogan"
            style={{ flexDirection: 'column', alignItems: 'center', fontSize: 'clamp(30px, 4.4vw, 52px)' }}
          >
            <span className="line l-blue">{t(dict, 'about.heroTitle')}</span>
            <span className="line l-blue">{t(dict, 'about.heroTitle2')}</span>
          </h1>

          <p className="hero-subline">{t(dict, 'about.heroTitleEn')}</p>
          <p className="hero-body">{t(dict, 'about.heroBody')}</p>
        </div>
      </section>

      {/* 01 — BỐI CẢNH / THỰC TRẠNG (phần A: khái niệm + 3 đặc điểm) */}
      <section className="section section--muted" id="about-context">
        <div className="container">
          <span className="s-eyebrow t-teal">
            <span className="s-eyebrow__num">{t(dict, 'about.s1Num')}</span>
            <span className="s-eyebrow__label">{t(dict, 'about.s1Kicker')}</span>
          </span>

          <div className="section-header">
            <h2 className="section-title">{t(dict, 'about.s1Title')}</h2>
          </div>

          <div className="intro-grid">
            {/* Thay placeholder bằng ảnh thật: <img src="/assets/about-context.jpg" alt="..." /> */}
            <figure className="intro-figure">
              <i data-lucide="smartphone" className="icon-2xl" />
            </figure>

            <div>
              <p className="about-prose">{t(dict, 'about.s1Body')}</p>
              <p className="about-prose">{t(dict, 'about.s1VnContext')}</p>
            </div>
          </div>

          {/* Ba đặc điểm môi trường số */}
          <div className="trait-grid" style={{ marginTop: 40 }}>
            {traits.map((tr, i) => (
              <div key={tr.num} className={`trait-card ${['t-teal', 't-blue', 't-orange'][i]}`}>
                <div className="trait-card__num">{tr.num}</div>
                <h3>{tr.title}</h3>
                <p>{tr.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 — BỐI CẢNH / THỰC TRẠNG (phần B: tác động trực tiếp / gián tiếp) */}
      <section className="section" id="about-impacts">
        <div className="container">
          <p className="about-prose">{t(dict, 'about.s1Bridge')}</p>

          {/* Tác động trực tiếp vs gián tiếp */}
          <div className="what-grid" style={{ marginTop: 40 }}>
            <div>
              <h3 className="impact-head impact-head--red">
                <i data-lucide="zap" className="icon-md" />
                {t(dict, 'about.directTitle')}
              </h3>
              <div className="bullet-list bullet-list--red">
                {directImpacts.map((im) => (
                  <div key={im.term} className="bullet-item">
                    <span className="glyph"><i data-lucide={im.icon} className="icon-sm" /></span>
                    <p><span className="term">{im.term}</span> <span className="en">({im.en})</span></p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="impact-head impact-head--orange">
                <i data-lucide="git-branch" className="icon-md" />
                {t(dict, 'about.indirectTitle')}
              </h3>
              <div className="bullet-list bullet-list--orange">
                {indirectImpacts.map((im) => (
                  <div key={im.term} className="bullet-item">
                    <span className="glyph"><i data-lucide={im.icon} className="icon-sm" /></span>
                    <p><span className="term">{im.term}</span> <span className="en">({im.en})</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <figure className="about-quote t-teal">
            <blockquote>“{t(dict, 'about.s1Quote')}”</blockquote>
            <cite>— {author}</cite>
          </figure>
        </div>
      </section>

      {/* 02 — VẤN ĐỀ */}
      <section className="section section--muted" id="about-problem">
        <div className="container">
          <span className="s-eyebrow t-blue">
            <span className="s-eyebrow__num">{t(dict, 'about.s2Num')}</span>
            <span className="s-eyebrow__label">{t(dict, 'about.s2Kicker')}</span>
          </span>

          <div className="section-header">
            <h2 className="section-title">{t(dict, 'about.s2Title')}</h2>
            <p className="section-lead about-en">{t(dict, 'about.s2TitleEn')}</p>
          </div>

          {challenges.map((c, i) => (
            <div key={c.title} className={`media-row t-blue ${i % 2 === 1 ? 'media-row--rev' : ''}`}>
              <div className="media-row__media"><i data-lucide={c.icon} className="icon-2xl" /></div>
              <div className="media-row__body">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </div>
          ))}

          <figure className="about-quote t-blue">
            <blockquote>“{t(dict, 'about.s2Quote')}”</blockquote>
            <cite>— {author}</cite>
          </figure>
        </div>
      </section>

      {/* 03 — GIẢI PHÁP */}
      <section className="section" id="about-solution">
        <div className="container">
          <span className="s-eyebrow t-orange">
            <span className="s-eyebrow__num">{t(dict, 'about.s3Num')}</span>
            <span className="s-eyebrow__label">{t(dict, 'about.s3Kicker')}</span>
          </span>

          <div className="section-header">
            <h2 className="section-title">{t(dict, 'about.s3Title')}</h2>
            <p className="section-lead about-en">{t(dict, 'about.s3TitleEn')}</p>
          </div>

          {solutions.map((s, i) => (
            <div key={s.title} className={`media-row t-orange ${i % 2 === 1 ? 'media-row--rev' : ''}`}>
              <div className="media-row__media"><i data-lucide={s.icon} className="icon-2xl" /></div>
              <div className="media-row__body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}

          <figure className="about-quote t-orange">
            <blockquote>“{t(dict, 'about.s3Quote')}”</blockquote>
            <cite>— {author}</cite>
          </figure>
        </div>
      </section>
    </>
  );
}
