/* Editorial photography, keyed by news category. All generated, no recognisable people. */
const BY_CATEGORY: Record<string, string> = {
  Festival: '/img/festival.jpg',
  Tickets: '/img/tickets.jpg',
  Venues: '/img/neon.jpg',
  Guide: '/img/greenroom.jpg',
  Spotlight: '/img/hero.jpg',
  Announcements: '/img/crowd.jpg',
};
export const imageForCategory = (category: string) => BY_CATEGORY[category] ?? '/img/seats.jpg';
