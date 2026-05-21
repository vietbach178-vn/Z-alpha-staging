import { redirect } from 'next/navigation';
import { DEFAULT_LANG } from '@/lib/i18n';

export default function RootPage() {
  // Root is reached only if proxy.ts misses (e.g. during static build); proxy handles in runtime.
  redirect(`/${DEFAULT_LANG}`);
}
