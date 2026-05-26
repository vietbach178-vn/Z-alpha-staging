import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import {
  FALLBACK_ORGANIZERS,
  FALLBACK_RESEARCHERS,
  FALLBACK_COLLABORATORS,
} from '@/data/team-sample';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/team'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'team.metaTitle') };
}

const placeholder = (initials: string) =>
  `https://placehold.co/300x300/d4b896/1a1a1a?text=${encodeURIComponent(initials)}`;

export default async function TeamPage({ params }: PageProps<'/[lang]/team'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  return (
    <>
      <section className="page-hero">
        <span className="glow glow-teal" />
        <span className="glow glow-blue" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="users" className="icon-sm" />
            {t(dict, 'nav.aboutMenu.team')}
          </span>
          <h1>{t(dict, 'team.title')}</h1>
          <p className="section-lead">
            {lang === 'vi'
              ? 'Chúng tôi tin rằng nghiên cứu chỉ thật sự có giá trị khi tạo ra tác động tích cực — đội ngũ Z & Alpha hội tụ những người tận tâm với sứ mệnh đó.'
              : 'We believe research only matters when it creates positive impact — the Z & Alpha team is made of people committed to that mission.'}
          </p>
        </div>
      </section>

      {/* THÀNH VIÊN TỔ CHỨC */}
      <section className="section" id="organizers" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="group-header g-blue">
            <span className="group-bar" aria-hidden="true" />
            <h2>{t(dict, 'team.organizer')}</h2>
          </div>

          <div className="org-members">
            {FALLBACK_ORGANIZERS.map((p) => (
              <article key={p.initials} className="org-member">
                <div className="org-member__left">
                  <div className="org-member__portrait">
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} />
                    ) : (
                      <span className="org-member__initials">{p.initials}</span>
                    )}
                  </div>
                  <p className="org-member__name">{p.name}</p>
                  <p className="org-member__role">{p.role[lang]}</p>
                </div>
                <div className="org-member__right">
                  {p.bio[lang].map((para, i) => (
                    <p key={i} className="org-member__bio">{para}</p>
                  ))}
                  {p.bullets && (
                    <ul className="org-member__bullets">
                      {p.bullets[lang].map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NGHIÊN CỨU VIÊN */}
      {FALLBACK_RESEARCHERS.length > 0 && (
        <section className="section section--muted" id="researchers">
          <div className="container">
            <div className="group-header g-blue">
              <span className="group-bar" aria-hidden="true" />
              <h2>{t(dict, 'team.researcher')}</h2>
            </div>

            <div className="people-grid">
              {FALLBACK_RESEARCHERS.map((p) => (
                <div key={p.initials} className="person-card">
                  <div className="person-photo">
                    {p.avatar ? <img src={p.avatar} alt={p.name} /> : <img src={placeholder(p.initials)} alt={p.name} />}
                  </div>
                  <div className="person-body">
                    <p className="person-name">{p.name}</p>
                    <p className="person-role">{p.role[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CỘNG TÁC VIÊN */}
      <section className="section" id="collaborators">
        <div className="container">
          <div className="group-header g-orange">
            <span className="group-bar" aria-hidden="true" />
            <h2>{t(dict, 'team.collaborator')}</h2>
          </div>

          <div className="people-grid">
            {FALLBACK_COLLABORATORS.map((p) => (
              <div key={p.initials} className="person-card">
                <div className="person-photo">
                  {p.avatar ? <img src={p.avatar} alt={p.name} /> : <img src={placeholder(p.initials)} alt={p.name} />}
                </div>
                <div className="person-body">
                  <p className="person-name">{p.name}</p>
                  <p className="person-role">{p.role[lang]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="principle-banner principle-banner--feature">
            <h2 className="principle-banner__heading">
              {lang === 'vi' ? 'Tinh thần chung của đội ngũ' : 'Our shared spirit'}
            </h2>
            <p className="principle-banner__text">
              {lang === 'vi'
                ? 'Mỗi thành viên Z & Alpha đều tận tâm, hợp tác và hướng tới cộng đồng, tin rằng nghiên cứu chỉ thật sự có giá trị khi tạo ra tác động tích cực trong đời sống con người.'
                : 'Every Z & Alpha member is dedicated, collaborative, and community-oriented, believing that research only matters when it creates positive impact in people\'s lives.'}
            </p>
          </div>
        </div>
      </section>

      <Newsletter dict={dict} />
    </>
  );
}
