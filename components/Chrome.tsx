'use client';

/* Nav + footer. Mounted once in the root layout; they never re-render on navigation. */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROVINCES } from '@/lib/data';
import { Icon } from './Icons';
import { Wordmark } from './Wordmark';

const LINKS = [
  ['/', 'Home'], ['/events', 'Events'], ['/comedians', 'Comedians'], ['/news', 'News'],
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);

  const current = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="container nav-inner">
        <Link className="brand" href="/"><Icon.logo className="brand-mark" /><span>The Giggling Cult</span></Link>
        <button className="nav-toggle icon-btn" aria-label="Menu" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}><Icon.menu /></button>
        <nav className="nav-links" id="nav-links" data-open={open}>
          {LINKS.map(([href, label]) => (
            <Link key={href} className="nav-link" href={href} aria-current={current(href) ? 'page' : undefined}>{label}</Link>
          ))}
          <Link className="btn btn-primary btn-sm nav-cta" href="/join">Join the Cult</Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Wordmark />
        <div className="footer-inner">
          <div>
            <Link className="brand" href="/"><Icon.logo className="brand-mark" /><span>The Giggling Cult</span></Link>
            <p>Every stand-up show in Mzansi, one calendar. All nine provinces, from the Cape to the Lowveld. No town too small.</p>
          </div>
          <div><h4>Wander</h4><ul><li><Link href="/events">The calendar</Link></li><li><Link href="/comedians">The congregation</Link></li><li><Link href="/news">The goss</Link></li></ul></div>
          <div><h4>Territories</h4><ul>{Object.values(PROVINCES).map((p) => <li key={p.id}><Link href={`/events?province=${p.id}`}>{p.name}</Link></li>)}</ul></div>
          <div><h4>Enlist</h4><ul><li><Link href="/join?as=comedian">I&apos;m funny (allegedly)</Link></li><li><Link href="/join?as=audience">I just want to laugh</Link></li><li><a href="mailto:hello@thegigglingcult.co.za">Talk to a human</a></li></ul></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} The Giggling Cult · Made in South Africa</span><span>Powered by Mirai Stack</span></div>
      </div>
    </footer>
  );
}
