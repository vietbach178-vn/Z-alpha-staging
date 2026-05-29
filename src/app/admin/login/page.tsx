import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, auth } from '@/lib/auth';

export const metadata = { title: 'Đăng nhập — Z & Alpha Admin' };

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const session = await auth();
  if (session) redirect('/admin');

  const sp = (await searchParams) as { callbackUrl?: string; error?: string };
  const target = sp.callbackUrl ?? '/admin';
  const hasError = sp.error === 'CredentialsSignin';

  async function login(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        email: String(formData.get('email') ?? '').trim(),
        password: String(formData.get('password') ?? ''),
        redirectTo: target,
      });
    } catch (err) {
      // signIn throws NEXT_REDIRECT on success — re-throw so Next can redirect.
      if (isRedirectError(err)) throw err;
      // Failed credentials: bounce back with error flag so the form shows a message.
      redirect(`/admin/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(target)}`);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '6rem auto', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: 14 }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Z & Alpha Admin</h1>

      {hasError && (
        <div style={{
          background: '#fef2f2', color: '#b91c1c', padding: '10px 14px',
          borderRadius: 8, marginBottom: 16, fontSize: 14,
          border: '1px solid #fecaca',
        }}>
          Email hoặc mật khẩu không đúng. Kiểm tra lại — có thể bị thừa khoảng trắng.
        </div>
      )}

      <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          <span style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email</span>
          <input
            type="email"
            name="email"
            required
            autoFocus
            defaultValue="admin@z-alpha.local"
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
