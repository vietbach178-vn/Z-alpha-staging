import { redirect } from 'next/navigation';
import { signIn, auth } from '@/lib/auth';

export const metadata = { title: 'Đăng nhập — Z & Alpha Admin' };

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const session = await auth();
  if (session) redirect('/admin');

  const { callbackUrl } = (await searchParams) as { callbackUrl?: string };
  const target = callbackUrl ?? '/admin';

  async function login(formData: FormData) {
    'use server';
    await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirectTo: target,
    });
  }

  return (
    <div style={{ maxWidth: 400, margin: '6rem auto', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: 14 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Z & Alpha Admin</h1>
      <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email</span>
          <input
            type="email"
            name="email"
            required
            autoFocus
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}
          />
        </label>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Mật khẩu</span>
          <input
            type="password"
            name="password"
            required
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }}
          />
        </label>
        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
