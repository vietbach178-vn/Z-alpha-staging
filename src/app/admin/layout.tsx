import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type NavItem = { href: string; label: string; icon: string };
type NavGroup = { title?: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'layout-dashboard' },
    ],
  },
  {
    title: 'Nghiên cứu',
    items: [
      { href: '/admin/research', label: 'Nghiên cứu', icon: 'flask-conical' },
      { href: '/admin/topics',   label: 'Chủ đề',     icon: 'tag' },
    ],
  },
  {
    title: 'Tin tức',
    items: [
      { href: '/admin/news',       label: 'Tin tức',  icon: 'newspaper' },
      { href: '/admin/categories', label: 'Danh mục', icon: 'folder' },
    ],
  },
  {
    items: [
      { href: '/admin/library',  label: 'Thư viện', icon: 'library' },
      { href: '/admin/contacts', label: 'Liên hệ',  icon: 'inbox' },
      { href: '/admin/media',    label: 'Media',    icon: 'image' },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const onLogin = false; // resolved per-route; layout always tries to gate
  // /admin/login uses pathname rule in proxy, but layout still wraps it. Let login render w/o sidebar:
  // We can't read pathname server-side here without router; assume layout shell is OK on login too.

  async function logout() {
    'use server';
    await signOut({ redirectTo: '/admin/login' });
  }

  if (!session) {
    // Login page renders standalone; other routes are guarded by proxy.ts.
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside
        style={{
          background: '#0f172a',
          color: '#e2e8f0',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ padding: '0 8px 20px', fontWeight: 700, fontSize: '1.1rem', borderBottom: '1px solid #1e293b', marginBottom: 12 }}>
          Z & Alpha
          <div style={{ fontSize: '.75rem', fontWeight: 400, color: '#64748b', marginTop: 4 }}>Admin</div>
        </div>
        {NAV.map((group, gi) => (
          <div
            key={group.title ?? `group-${gi}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: gi === 0 ? 0 : 12 }}
          >
            {group.title && (
              <div
                style={{
                  padding: '0 12px',
                  fontSize: '.7rem',
                  fontWeight: 600,
                  letterSpacing: '.05em',
                  textTransform: 'uppercase',
                  color: '#64748b',
                  marginBottom: 2,
                }}
              >
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  color: '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <i data-lucide={item.icon} className="icon-sm" />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: '.8rem', color: '#64748b', padding: '0 8px', marginBottom: 8 }}>
            {session.user?.email}
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #334155',
                color: '#e2e8f0',
                padding: '8px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '.85rem',
              }}
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <main style={{ background: '#f8fafc', padding: '32px 40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
