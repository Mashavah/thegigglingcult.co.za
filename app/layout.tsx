import type { Metadata } from 'next';
import { Anton, Inter, Montserrat } from 'next/font/google';
import { Footer, Nav } from '@/components/Chrome';
import { UIProvider } from '@/components/UIProvider';
import './globals.css';

const display = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const nav = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thegigglingcult.co.za'),
  title: {
    default: "The Giggling Cult — SA's Home of Stand-Up Comedy",
    template: '%s — The Giggling Cult',
  },
  description:
    'Discover South African stand-up comedy, upcoming shows, comedians and comedy news. Launching across Gauteng, Western Cape, KwaZulu-Natal and Eastern Cape.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'The Giggling Cult',
    title: "The Giggling Cult — SA's Home of Stand-Up Comedy",
    description:
      'Discover shows, meet comedians and follow South African comedy culture.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Giggling Cult — SA's Home of Stand-Up Comedy",
    description:
      'Discover shows, meet comedians and follow South African comedy culture.',
  },
};

// Demo data is generated relative to "today", so render per request rather than at build time.
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${nav.variable} ${body.variable}`}>
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
