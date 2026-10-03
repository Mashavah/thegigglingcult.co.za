import { COMEDIANS, EVENTS, NEWS, TODAY, VENUES } from './data';
import type { Comedian, Event, ProvinceFilter, ProvinceId } from './types';

export const bySlug: Record<string, Comedian> = Object.fromEntries(COMEDIANS.map((c) => [c.slug, c]));

export const comedian = (slug: string): Comedian | undefined => bySlug[slug];
export const event = (id: string): Event | undefined => EVENTS.find((e) => e.id === id);
export const article = (slug: string) => NEWS.find((n) => n.slug === slug);

export const eventProvince = (e: Event): ProvinceId => VENUES[e.venue].province;

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const startOfWeek = (d: Date = TODAY) => {
  const s = new Date(d);
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); // Monday
  return s;
};
export const endOfWeek = (d: Date = TODAY) => {
  const e = startOfWeek(d);
  e.setDate(e.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
};
export const endOfMonth = (d: Date = TODAY) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

export const inProvince = (e: Event, p: ProvinceFilter) => p === 'all' || eventProvince(e) === p;

export const eventsBetween = (from: Date, to: Date, p: ProvinceFilter = 'all') =>
  EVENTS.filter((e) => e.date >= from && e.date <= to && inProvince(e, p));

export const upcomingEvents = (p: ProvinceFilter = 'all') => EVENTS.filter((e) => e.date >= TODAY && inProvince(e, p));

export const upcomingFor = (slug: string, p: ProvinceFilter = 'all') =>
  EVENTS.filter((e) => e.date >= TODAY && e.lineup.includes(slug) && inProvince(e, p));

export const sortedComedians = [...COMEDIANS].sort((a, b) => a.name.localeCompare(b.name));

export const firstLetter = (c: Comedian) => c.name[0].toUpperCase();

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const TYPE_LABEL: Record<Event['type'], string> = {
  headline: 'Headline show', showcase: 'Showcase', openmic: 'Open mic', special: 'Special', festival: 'Festival', tour: 'Tour',
};

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
