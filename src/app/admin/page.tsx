import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const metadata = { title: 'Dashboard — Z & Alpha Admin' };

export default async function AdminDashboard() {
  const session = await auth();

  const [researchCount, newsCount, topicCount, categoryCount] = await Promise.all([
    prisma.researchArticle.count(),
    prisma.newsItem.count(),
    prisma.topic.count(),
    prisma.newsCategory.count(),
  ]);

  async function logout() {
    'use server';
    await signOut({ redirectTo: '/admin/login' });
  }

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Z & Alpha Admin</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '.9rem' }}>{session?.user?.email}</span>
          <form action={logout}>
            <button type="submit" className="btn btn-outline">Đăng xuất</button>
          </form>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2.5rem' }}>
        {[
          { label: 'Bài nghiên cứu', count: researchCount, href: '/admin/research' },
          { label: 'Tin tức',         count: newsCount,     href: '/admin/news' },
          { label: 'Chủ đề',          count: topicCount,    href: '/admin/topics' },
          { label: 'Danh mục tin',    count: categoryCount, href: '/admin/categories' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              textDecoration: 'none',
              color: 'inherit',
              background: '#fff',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.count}</div>
            <div style={{ color: '#6b7280', fontSize: '.9rem' }}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>Quản lý nhanh</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <li><Link href="/admin/research/new" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>+ Bài research mới</Link></li>
          <li><Link href="/admin/news/new"     className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>+ Tin tức mới</Link></li>
          <li><Link href="/admin/media"        className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Thư viện ảnh/video</Link></li>
        </ul>
      </section>
    </div>
  );
}
