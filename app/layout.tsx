import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter, Manrope } from 'next/font/google';
import { Footer, Nav } from '@/components/Chrome';
import { UIProvider } from '@/components/UIProvider';
import './globals.css';

const display = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono', display: 'swap' });
const body = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'The Giggling Cult — Every stand-up show in South Africa', template: '%s — The Giggling Cult' },
  description: 'The central point for South African stand-up comedy. Browse shows across all nine provinces, discover comedians and get the week in comedy.',
  icons: { icon: '/favicon.svg' },
};

// Demo data is generated relative to "today", so render per request rather than at build time.
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>
        <UIProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </UIProvider>
      </body>
    </html>
  );
}
