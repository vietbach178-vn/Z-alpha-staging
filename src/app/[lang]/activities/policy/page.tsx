import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/activities/policy'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'activitiesPolicy.metaTitle') };
}

export default async function ActivitiesPolicyPage({ params }: PageProps<'/[lang]/activities/policy'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  // agenda is an array of [time, content] tuples — read directly from dict
  const agenda = (dict as unknown as { activitiesPolicy: { agenda: string[][] } }).activitiesPolicy.agenda;

  const attendees = [
    'attendee1', 'attendee2', 'attendee3', 'attendee4', 'attendee5', 'attendee6', 'attendee7',
  ];

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <span className="glow glow-blue" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="landmark" className="icon-sm" />
            {t(dict, 'activitiesPolicy.heroEyebrow')}
          </span>
          <h1>{t(dict, 'activitiesPolicy.title')}</h1>
          <p className="section-lead">{t(dict, 'activitiesPolicy.lead')}</p>
        </div>
      </section>

      {/* FEATURED CONFERENCE */}
      <section className="section">
        <div className="container">
          <article className="featured-hero">
            <div className="featured-hero__body">
              <div className="featured-hero__icons" aria-hidden="true">
                <div className="t1"><i data-lucide="calendar-days" className="icon-md" /></div>
                <div className="t3"><i data-lucide="landmark" className="icon-md" /></div>
                <div className="t2"><i data-lucide="users" className="icon-md" /></div>
              </div>
              <span className="badge">
                <i data-lucide="calendar" className="icon-sm" />
                {t(dict, 'activitiesPolicy.featuredEyebrow')}
              </span>
              <h2 className="featured-hero__title">{t(dict, 'activitiesPolicy.featuredTitle')}</h2>
              <p className="featured-hero__desc">{t(dict, 'activitiesPolicy.featuredDate')}</p>
            </div>
          </article>
        </div>
      </section>

      {/* CONTEXT */}
      <section className="section section--muted" id="context">
        <div className="container">
          <div className="what-grid">
            <div>
              <div className="section-header" style={{ marginBottom: 0 }}>
                <h2 className="section-title">{t(dict, 'activitiesPolicy.contextTitle')}</h2>
              </div>
            </div>
            <div>
              <p className="section-lead" style={{ margin: '0 0 16px' }}>
                {t(dict, 'activitiesPolicy.contextP1')}
              </p>
              <p className="section-lead" style={{ margin: 0 }}>
                {t(dict, 'activitiesPolicy.contextP2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERNATIONAL ACTION */}
      <section className="section" id="intl">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'activitiesPolicy.intlTitle')}</h2>
            <p className="section-lead">{t(dict, 'activitiesPolicy.intlLead')}</p>
          </div>

          <div className="focus-grid">
            <article className="focus-card t-teal">
              <div className="icon-tile"><i data-lucide="flag" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesPolicy.intl1Country')}</h3>
              <p>{t(dict, 'activitiesPolicy.intl1Body')}</p>
            </article>
            <article className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="flag" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesPolicy.intl2Country')}</h3>
              <p>{t(dict, 'activitiesPolicy.intl2Body')}</p>
            </article>
            <article className="focus-card t-orange">
              <div className="icon-tile"><i data-lucide="flag" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesPolicy.intl3Country')}</h3>
              <p>{t(dict, 'activitiesPolicy.intl3Body')}</p>
            </article>
          </div>

          <div className="principle-banner" style={{ marginTop: 48 }}>
            <div className="principle-banner__icon">
              <i data-lucide="map-pin" className="icon-md" />
            </div>
            <div>
              <h3 className="section-title" style={{ fontSize: 20, marginBottom: 12, color: 'var(--blue-700)' }}>
                {t(dict, 'activitiesPolicy.vnTitle')}
              </h3>
              <p className="principle-banner__text">{t(dict, 'activitiesPolicy.vnBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="section section--muted" id="goals">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'activitiesPolicy.goalsTitle')}</h2>
            <p className="section-lead">{t(dict, 'activitiesPolicy.goalsLead')}</p>
          </div>

          <ul className="bullet-list">
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="globe" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.goal1')}</p>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="message-circle-question" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.goal2')}</p>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="scale" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.goal3')}</p>
            </li>
          </ul>
        </div>
      </section>

      {/* KEY DISCUSSION */}
      <section className="section" id="discussion">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'activitiesPolicy.discussionTitle')}</h2>
          </div>

          <ul className="bullet-list">
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="help-circle" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.discussion1')}</p>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="help-circle" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.discussion2')}</p>
            </li>
            <li className="bullet-item">
              <span className="glyph"><i data-lucide="help-circle" className="icon" /></span>
              <p>{t(dict, 'activitiesPolicy.discussion3')}</p>
            </li>
          </ul>
        </div>
      </section>

      {/* EVENT INFO */}
      <section className="section section--muted" id="info">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'activitiesPolicy.infoTitle')}</h2>
          </div>

          <div className="what-grid" style={{ alignItems: 'start' }}>
            <div className="focus-card t-blue">
              <div className="icon-tile"><i data-lucide="calendar" className="icon-lg" /></div>
              <h3>{t(dict, 'activitiesPolicy.infoTime')}</h3>
              <p>{t(dict, 'activitiesPolicy.infoTimeValue')}</p>
            </div>

            <div>
              <h3 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--fg-3)',
                margin: '0 0 16px',
              }}>
                {t(dict, 'activitiesPolicy.infoAttendees')}
              </h3>
              <ul className="bullet-list">
                {attendees.map((key) => (
                  <li key={key} className="bullet-item">
                    <span className="glyph"><i data-lucide="users" className="icon" /></span>
                    <p>{t(dict, `activitiesPolicy.${key}`)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="section" id="agenda">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'activitiesPolicy.agendaTitle')}</h2>
          </div>

          <div className="policy-agenda-wrap">
            <table className="policy-agenda">
              <thead>
                <tr>
                  <th>{t(dict, 'activitiesPolicy.agendaTimeCol')}</th>
                  <th>{t(dict, 'activitiesPolicy.agendaContentCol')}</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map((row, i) => (
                  <tr key={i}>
                    <td className="policy-agenda__time">{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} />
    </>
  );
}
