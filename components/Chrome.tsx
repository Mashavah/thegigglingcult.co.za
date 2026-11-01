'use client';

/* Global navigation and footer. */

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PROVINCES } from '@/lib/data';
import type { ProvinceId } from '@/lib/types';
import { Icon } from './Icons';

const LINKS = [
  ['/', 'Home'],
  ['/events', 'Events'],
  ['/comedians', 'Comedians'],
  ['/news', 'News'],
] as const;

const LAUNCH_PROVINCES: ProvinceId[] = ['gp', 'wc', 'kzn', 'ec'];

function BrandLockup({ priority = false, stacked = false }: { priority?: boolean; stacked?: boolean }) {
  return stacked ? (
    <Image
      className="brand-logo brand-logo-stacked"
      src="/brand/tgc-logo-stacked.png"
      alt="The Giggling Cult"
      width={168}
      height={183}
    />
  ) : (
    <Image
      className="brand-logo brand-logo-horizontal"
      src="/brand/tgc-logo-horizontal.png"
      alt="The Giggling Cult"
      width={286}
      height={104}
      priority={priority}
    />
  );
}

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="container nav-inner">
        <Link className="brand brand-wordmark" href="/" aria-label="The Giggling Cult home">
          <BrandLockup priority />
        </Link>

        <button
          className="nav-toggle icon-btn"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon.menu />
        </button>

        <nav className="nav-links" id="nav-links" data-open={open}>
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              className="nav-link"
              href={href}
              aria-current={current(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}

          <Link className="btn btn-primary btn-sm nav-cta" href="/join">
            Join the Cult
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <Link
              className="brand brand-wordmark footer-brand"
              href="/"
              aria-label="The Giggling Cult home"
            >
              <BrandLockup stacked />
            </Link>

            <p>
              SA&apos;s home of stand-up comedy. Discover shows, meet comedians
              and follow the culture across our four launch provinces.
            </p>

            <p className="small muted">
              Starting where the scene is loudest — more provinces unlocking soon.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/events">Events calendar</Link></li>
              <li><Link href="/comedians">Comedians A–Z</Link></li>
              <li><Link href="/news">Comedy news</Link></li>
            </ul>
          </div>

          <div>
            <h4>Launch Provinces</h4>
            <ul>
              {LAUNCH_PROVINCES.map((id) => (
                <li key={id}>
                  <Link href={`/events?province=${id}`}>{PROVINCES[id].name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Join the Cult</h4>
            <ul>
              <li><Link href="/join?as=audience">Join as an audience member</Link></li>
              <li><Link href="/join?as=comedian">Join as a comedian</Link></li>
              <li><Link href="/join?as=venue">Join as a venue</Link></li>
              <li><a href="mailto:hello@thegigglingcult.co.za">Talk to a human</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} The Giggling Cult · Made in South Africa</span>
          <span>Powered by Mirai Stack</span>
        </div>
      </div>
    </footer>
  );
}
