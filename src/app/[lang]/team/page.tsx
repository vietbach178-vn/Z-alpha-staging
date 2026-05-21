import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import { FALLBACK_RESEARCHERS, FALLBACK_YOUNG_RESEARCHERS } from '@/data/team-sample';
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
            {t(dict, 'nav.team')}
          </span>
          <h1>{t(dict, 'team.title')}</h1>
          <p className="section-lead">
            {lang === 'vi'
              ? 'Chúng tôi tin rằng nghiên cứu chỉ thật sự có giá trị khi tạo ra tác động tích cực — đội ngũ Z & Alpha hội tụ những người tận tâm với sứ mệnh đó.'
              : 'We believe research only matters when it creates positive impact — the Z & Alpha team is made of people committed to that mission.'}
          </p>
        </div>
      </section>

      <section className="section" id="researchers" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="group-header g-blue">
            <span className="group-bar" aria-hidden="true" />
            <h2>{t(dict, 'team.researcher')}</h2>
          </div>

          <div className="people-grid">
            {FALLBACK_RESEARCHERS.map((p) => (
              <a key={p.initials} href="#" className="person-card">
                <div className="person-photo"><img src={placeholder(p.initials)} alt={p.name} /></div>
                <div className="person-body">
                  <p className="person-name">{p.name}</p>
                  <p className="person-role">{p.role[lang]}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted" id="young-researchers">
        <div className="container">
          <div className="group-header g-orange">
            <span className="group-bar" aria-hidden="true" />
            <h2>{t(dict, 'team.youngResearcher')}</h2>
          </div>

          <div className="people-grid">
            {FALLBACK_YOUNG_RESEARCHERS.map((p) => (
              <a key={p.initials} href="#" className="person-card">
                <div className="person-photo"><img src={placeholder(p.initials)} alt={p.name} /></div>
                <div className="person-body">
                  <p className="person-name">{p.name}</p>
                  <p className="person-role">{p.role[lang]}</p>
                </div>
              </a>
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
