import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Z & Alpha',
  description: 'Z & Alpha Initiative — nghiên cứu, kết nối, hành động.',
  icons: { icon: '/assets/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        {/* Lucide icons via CDN — kept identical to Astro version */}
        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" async />
        <script
          // re-render icons whenever route or content changes; safe to run on every nav
          dangerouslySetInnerHTML={{
            __html: `
              const renderLucide = () => { if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2 } }); };
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', renderLucide);
              } else {
                setTimeout(renderLucide, 0);
              }
              // Re-render on Next.js client-side navigation
              const observer = new MutationObserver(() => setTimeout(renderLucide, 50));
              observer.observe(document.body, { childList: true, subtree: true });
            `,
          }}
        />
      </body>
    </html>
  );
}
