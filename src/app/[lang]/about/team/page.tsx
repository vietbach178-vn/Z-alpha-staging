import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import {
  FALLBACK_ORGANIZERS,
  FALLBACK_RESEARCHERS,
  FALLBACK_COLLABORATORS,
} from '@/data/team-sample';
import TeamOrganizerGrid from '@/components/public/TeamOrganizerGrid';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/about/team'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'team.metaTitle') };
}

const placeholder = (initials: string) =>
  `https://placehold.co/300x300/d4b896/1a1a1a?text=${encodeURIComponent(initials)}`;

export default async function TeamPage({ params }: PageProps<'/[lang]/about/team'>) {
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

      {/* THÀNH VIÊN TỔ CHỨC — grid + modal */}
      <section className="section" id="organizers" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(dict, 'team.organizer')}</h2>
            <p className="section-lead">
              {lang === 'vi' ? 'Nhấn vào từng thành viên để xem thông tin chi tiết.' : 'Click each member to view bio.'}
            </p>
          </div>

          <TeamOrganizerGrid
            organizers={FALLBACK_ORGANIZERS}
            lang={lang}
            closeLabel={lang === 'vi' ? 'Đóng' : 'Close'}
            pastRolesLabel={t(dict, 'team.pastRoles')}
            highlightsLabel={t(dict, 'team.highlights')}
          />
        </div>
      </section>

      {/* NGHIÊN CỨU VIÊN */}
      {FALLBACK_RESEARCHERS.length > 0 && (
        <section className="section section--muted" id="researchers">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t(dict, 'team.researcher')}</h2>
            </div>

            <div className="people-grid">
              {FALLBACK_RESEARCHERS.map((p) => (
                <div key={p.initials} className="person-card">
                  <div className="person-photo">
                    <img src={p.avatar ?? placeholder(p.initials)} alt={p.name} />
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
      {FALLBACK_COLLABORATORS.length > 0 && (
        <section className="section" id="collaborators">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{t(dict, 'team.collaborator')}</h2>
            </div>

            <div className="people-grid">
              {FALLBACK_COLLABORATORS.map((p) => (
                <div key={p.initials} className="person-card">
                  <div className="person-photo">
                    <img src={p.avatar ?? placeholder(p.initials)} alt={p.name} />
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

      <Newsletter dict={dict} />
    </>
  );
}
