import type { SVGProps } from 'react';
import type { SocialNetwork } from '@/lib/types';

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const Icon = {
  instagram: (p: P) => <svg {...base} {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  x: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2.1l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2zm-1.1 18h1.8L7.3 3.9H5.4L17.8 20z" /></svg>,
  tiktok: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.5 2c.3 2.4 1.7 3.9 4.1 4.1v3.4c-1.5 0-2.9-.5-4.1-1.3v6.4a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3.5a2.5 2.5 0 1 0 1.6 2.3V2h3.4z" /></svg>,
  youtube: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23 7.2a2.9 2.9 0 0 0-2-2C19.2 4.7 12 4.7 12 4.7s-7.2 0-9 .5a2.9 2.9 0 0 0-2 2C.5 9 .5 12 .5 12s0 3 .5 4.8a2.9 2.9 0 0 0 2 2c1.8.5 9 .5 9 .5s7.2 0 9-.5a2.9 2.9 0 0 0 2-2c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8zM9.7 15.1V8.9l6 3.1-6 3.1z" /></svg>,
  facebook: (p: P) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M14 8h3V4h-3c-2.8 0-4.5 1.7-4.5 4.5V11H7v4h2.5v7h4v-7H17l.5-4H13.5V8.8c0-.5.2-.8.5-.8z" /></svg>,
  arrow: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  check: (p: P) => <svg {...base} strokeWidth={2.5} {...p}><path d="M5 12.5l4.5 4.5L19 7" /></svg>,
  close: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>,
  left: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M15 6l-6 6 6 6" /></svg>,
  right: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M9 6l6 6-6 6" /></svg>,
  search: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>,
  menu: (p: P) => <svg {...base} strokeWidth={2.2} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>,
  pin: (p: P) => <svg {...base} {...p}><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  mic: (p: P) => <svg {...base} {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>,
  mail: (p: P) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 8l9 6 9-6" /></svg>,
  ticket: (p: P) => <svg {...base} {...p}><path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 0 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v3z" /><path d="M13 5v14" strokeDasharray="2 3" /></svg>,
  star: (p: P) => <svg {...base} {...p}><path d="M12 3l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.5l-5.7 3 1.1-6.3L2.8 9.7l6.4-.9L12 3z" /></svg>,
  logo: (p: P) => <svg viewBox="0 0 32 32" fill="none" {...p}><circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" /><path d="M9.5 18c1.5 3.5 4 5 6.5 5s5-1.5 6.5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="11.5" cy="12" r="1.6" fill="currentColor" /><circle cx="20.5" cy="12" r="1.6" fill="currentColor" /></svg>,
};

export const SOCIAL_URL: Record<SocialNetwork, (h: string) => string> = {
  instagram: (h) => `https://instagram.com/${h}`,
  x: (h) => `https://x.com/${h}`,
  tiktok: (h) => `https://tiktok.com/@${h}`,
  youtube: (h) => `https://youtube.com/${h}`,
  facebook: (h) => `https://facebook.com/${h}`,
};
export const SOCIAL_LABEL: Record<SocialNetwork, string> = { instagram: 'Instagram', x: 'X', tiktok: 'TikTok', youtube: 'YouTube', facebook: 'Facebook' };
